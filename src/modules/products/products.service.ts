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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(DigitalProduct.name) private digitalProductModel: Model<DigitalProduct>,
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