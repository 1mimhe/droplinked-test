import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CollectionDocument = Collection & Document;

@Schema({ timestamps: true })
export class Collection {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Merchant', required: true })
  merchantId: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

// Indexes
CollectionSchema.index({ merchantId: 1 });
CollectionSchema.index({ isActive: 1 });
