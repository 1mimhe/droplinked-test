import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from './product.base.schema';
import { Dimensions, DimensionsSchema } from './shared/dimensions.schema';
import { VariantGroup, VariantGroupSchema } from './shared/variant.schema';
import { ShippingMethod } from '../../../common/enums/product.enums';
import { SKU, SKUSchema } from './shared/sku.schema';

@Schema()
export class PhysicalProduct extends Product {
  @Prop({ type: [VariantGroupSchema], default: [] })
  variantGroups: VariantGroup[];

  @Prop({ type: [SKUSchema], default: [] })
  skuMatrix: SKU[];

  @Prop({ type: DimensionsSchema })
  dimensions: Dimensions;

  @Prop({ enum: ShippingMethod })
  shippingMethod: ShippingMethod;
}

export const PhysicalProductSchema = SchemaFactory.createForClass(PhysicalProduct);