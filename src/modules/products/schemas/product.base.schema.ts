import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductType, ProductStatus, ProductVisibility } from '../../../common/enums/product.enums';

@Schema({ 
  timestamps: true, 
  discriminatorKey: 'type',
  collection: 'products'
})
export class Product {
  @Prop({ required: true, maxlength: 100 })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  type: ProductType;

  @Prop({ required: true, enum: ProductStatus, default: ProductStatus.DRAFT, index: true })
  status: ProductStatus;

  @Prop({ required: true, enum: ProductVisibility, default: ProductVisibility.PRIVATE })
  visibility: ProductVisibility;

  @Prop({ type: Types.ObjectId, ref: 'Merchant', required: true, index: true })
  merchantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Collection', index: true })
  collectionId?: Types.ObjectId;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ merchantId: 1, type: 1 });
ProductSchema.index({ createdAt: -1 });