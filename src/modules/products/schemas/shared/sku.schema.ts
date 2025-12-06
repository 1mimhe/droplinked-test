import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class SKU {
  @Prop({ required: true })
  skuCode: string;

  @Prop({ type: Map, of: String, required: true })
  variantCombination: string[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop()
  externalId?: string;
}

export const SKUSchema = SchemaFactory.createForClass(SKU);
