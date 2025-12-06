import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Dimensions {
  @Prop({ required: true, min: 0 })
  length: number;

  @Prop({ required: true, min: 0 })
  width: number;

  @Prop({ required: true, min: 0 })
  height: number;

  @Prop({ required: true, default: 'cm' })
  unit: string;
}

export const DimensionsSchema = SchemaFactory.createForClass(Dimensions);
