import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from './product.base.schema';

@Schema({ _id: false })
class DeliveryInfo {
  @Prop()
  message?: string;

  @Prop()
  url?: string;
}
const DeliveryInfoSchema = SchemaFactory.createForClass(DeliveryInfo);

@Schema()
export class DigitalProduct extends Product {
  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop({ type: DeliveryInfoSchema })
  deliveryInfo: DeliveryInfo;
}

export const DigitalProductSchema = SchemaFactory.createForClass(DigitalProduct);