import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.base.schema';
import { DigitalProduct } from './schemas/digital-product.schema';
import { PhysicalProduct } from './schemas/physical-product.schema';
import { CreateDigitalProductDto } from './dto/create-digital-product.dto';
import { ProductStatus } from '../../common/enums/product.enums';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(DigitalProduct.name) private digitalProductModel: Model<DigitalProduct>,
  ) {}

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
}