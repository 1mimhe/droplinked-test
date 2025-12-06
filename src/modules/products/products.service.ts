import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.base.schema';
import { DigitalProduct } from './schemas/digital-product.schema';
import { CreateDigitalProductDto } from './dto/create-digital-product.dto';
import { ProductStatus, ProductType } from '../../common/enums/product.enums';
import { CreatePhysicalProductDto } from './dto/create-physical-product.dto';
import { VariantGroupDto } from './dto/shared/variant.dto';
import { SkuDto } from './dto/shared/sku.dto';
import { PhysicalProduct } from './schemas/physical-product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(DigitalProduct.name) private digitalProductModel: Model<DigitalProduct>,
    @InjectModel(PhysicalProduct.name) private physicalProductModel: Model<PhysicalProduct>,
  ) {}

  // ============================================
  // READ Operations
  // ============================================

  async findAll(query: { merchantId?: string; type?: ProductType; status?: ProductStatus }) {
    const filter: any = {};
    if (query.merchantId) filter.merchantId = new Types.ObjectId(query.merchantId);
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;

    return this.productModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  // ============================================
  // Digital Product Operations
  // ============================================

  async createDigital(dto: CreateDigitalProductDto): Promise<Product> {
    if (dto.status === ProductStatus.PUBLISHED) {
      this.validateDigitalPublish(dto);
    }

    const newProduct = new this.digitalProductModel({
      ...dto,
      merchantId: new Types.ObjectId(dto.merchantId), 
      collectionId: dto.collectionId ? new Types.ObjectId(dto.collectionId) : undefined,
    });
    return newProduct.save();
  }

  async updateDigital(id: string, dto: Partial<CreateDigitalProductDto>): Promise<Product> {
    const existing = await this.digitalProductModel.findById(id);
    if (!existing) throw new NotFoundException('Product not found');
    if (existing.type !== ProductType.DIGITAL) throw new BadRequestException('Product is not Digital');

    const merged = { ...existing.toObject(), ...dto };

    if (merged.status === ProductStatus.PUBLISHED) {
      this.validateDigitalPublish(merged as CreateDigitalProductDto);
    }

    return this.digitalProductModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec() as Promise<Product>;
  }

  // ============================================
  // Physical Product Operations
  // ============================================

  async createPhysical(dto: CreatePhysicalProductDto): Promise<Product> {
    let finalSkuMatrix: any[] = [];
    
    if (dto.variantGroups && dto.variantGroups.length > 0) {
      finalSkuMatrix = this.generateSkuMatrix(dto.variantGroups, dto.skus);
    }

    // Validate Publish Rules (using the fully constructed data)
    const fullDataForValidation = { ...dto, skus: finalSkuMatrix };
    if (dto.status === ProductStatus.PUBLISHED) {
      this.validatePhysicalPublish(fullDataForValidation);
    }

    const newProduct = new this.physicalProductModel({
      ...dto,
      skuMatrix: finalSkuMatrix, // Save the generated matrix (with skuCodes)
      merchantId: new Types.ObjectId(dto.merchantId), 
      collectionId: dto.collectionId ? new Types.ObjectId(dto.collectionId) : undefined,
    });

    return newProduct.save();
  }

  async updatePhysical(id: string, dto: Partial<CreatePhysicalProductDto>): Promise<Product> {
    const existing = await this.physicalProductModel.findById(id);
    if (!existing) throw new NotFoundException('Product not found');
    if (existing.type !== ProductType.PHYSICAL) throw new BadRequestException('Product is not Physical');

    const merged = { ...existing.toObject(), ...dto };

    // Validate Publish Rules
    if (merged.status === ProductStatus.PUBLISHED) {
      this.validatePhysicalPublish(merged as CreatePhysicalProductDto);
    }

    // Validate SKU integrity if variants or SKUs had changes
    if (dto.variantGroups || dto.skus) {
      this.validateSkuIntegrity(
        dto.variantGroups || existing.variantGroups, 
        dto.skus || existing.skuMatrix
      );
    }

    return this.physicalProductModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec() as Promise<Product>;
  }

  // ============================================
  // Validation Logics
  // ============================================

  private validateDigitalPublish(data: CreateDigitalProductDto) {
    const errors: string[] = [];
    
    if (!data.title) errors.push('Title is required');
    if (!data.description) errors.push('Description is required');
    if (!data.collectionId) errors.push('Collection is required');
    if (!data.images || data.images.length === 0) errors.push('At least one image is required');

    if (data.price === undefined || data.price === null) errors.push('Price is required');
    if (data.quantity === undefined || data.quantity === null) errors.push('Quantity is required');

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation Failed', errors });
    }
  }

  private validatePhysicalPublish(data: CreatePhysicalProductDto) {
    const errors: string[] = [];

    // Base Validations
    if (!data.title) errors.push('Title is required');
    if (!data.description) errors.push('Description is required');
    if (!data.collectionId) errors.push('Collection is required');
    if (!data.images || data.images.length === 0) errors.push('At least one image is required');

    // Dimensions
    if (!data.dimensions || 
        !data.dimensions.weight || 
        !data.dimensions.length || 
        !data.dimensions.width || 
        !data.dimensions.height) {
      errors.push('Dimensions (L/W/H) and Weight are required');
    }
    
    if (!data.shippingMethod) errors.push('Shipping Method is required');

    // Variants
    if (!data.variantGroups || data.variantGroups.length === 0) {
      errors.push('At least 1 variant group is required');
    }

    // SKU Existence
    if (!data.skus || data.skus.length === 0) {
      errors.push('SKU Matrix is required');
    } else {
      // Check individual SKUs
      data.skus.forEach((sku, i) => {
        if (sku.price === undefined) errors.push(`SKU #${i} missing Price`);
        if (sku.quantity === undefined) errors.push(`SKU #${i} missing Quantity`);
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation Failed', errors });
    }
  }

  private validateSkuIntegrity(variants: VariantGroupDto[], skus: SkuDto[]) {
    // Check Expected Count
    const expectedCount = variants.reduce((acc, group) => acc * group.values.length, 1);
    if (skus.length !== expectedCount) {
      throw new BadRequestException(
        `Variant configuration requires ${expectedCount} SKUs, but received ${skus.length}`
      );
    }

    // Validate Values
    const allowedValues = new Set(variants.flatMap(v => v.values));

    skus.forEach((sku, index) => {
      if (!sku.variantCombination || sku.variantCombination.length !== variants.length) {
        throw new BadRequestException(`SKU #${index} variant combination length mismatch`);
      }

      sku.variantCombination.forEach(val => {
        if (!allowedValues.has(val)) {
          throw new BadRequestException(`SKU #${index} contains invalid value: "${val}"`);
        }
      });
    });
  }

  // ============================================
  // SKU Matrix Generation
  // ============================================

  /**
   * Generate SKU matrix from variant groups
   */
  private generateSkuMatrix(
    variantGroups: VariantGroupDto[],
    existingSKUs: SkuDto[] = [],
  ): any[] {
    if (!variantGroups || variantGroups.length === 0) {
      return [];
    }

    // Generate all variant combinations
    const combinations = this.generateVariantCombinations(variantGroups);

    // Create SKU for each combination
    const skus = combinations.map((combination) => {
      const skuCode = this.generateSkuCode(combination);

      // Check if SKU data exists in provided data
      const existingSKU = existingSKUs.find((sku) => {
        if (!sku.variantCombination) return false;
        return (
          JSON.stringify(sku.variantCombination) ===
          JSON.stringify(combination)
        );
      });

      return {
        skuCode,
        variantCombination: combination,
        price: existingSKU?.price || 0,
        quantity: existingSKU?.quantity || 0,
        externalId: existingSKU?.externalId || undefined,
      };
    });

    return skus;
  }

  /**
   * Generate all possible variant combinations
   */
  private generateVariantCombinations(
    variantGroups: any[],
  ): Record<string, string>[] {
    if (variantGroups.length === 0) return [{}];

    if (variantGroups.length === 1) {
      return variantGroups[0].values.map((v: any) => ({
        [variantGroups[0].name]: v.value,
      }));
    }

    // Two variant groups - create cartesian product
    const combinations: Record<string, string>[] = [];
    const group1 = variantGroups[0];
    const group2 = variantGroups[1];

    group1.values.forEach((v1: any) => {
      group2.values.forEach((v2: any) => {
        combinations.push({
          [group1.name]: v1.value,
          [group2.name]: v2.value,
        });
      });
    });

    return combinations;
  }

  /**
   * Generate SKU code from variant combination
   */
  private generateSkuCode(combination: Record<string, string>): string {
    const values = Object.values(combination)
      .map((v) => v.toUpperCase().replace(/\s+/g, '-'))
      .join('-');

    return `SKU-${values}`;
  }
}