import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class VariantGroup {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  values: string[];
}
export const VariantGroupSchema = SchemaFactory.createForClass(VariantGroup);