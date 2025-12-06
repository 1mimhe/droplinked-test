import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductBaseDto } from './create-product.base.dto';
import { DimensionsDto } from './shared/dimensions.dto';
import { VariantGroupDto } from './shared/variant.dto';
import { SkuDto } from './shared/sku.dto';
import { ShippingMethod } from '../../../common/enums/product.enums';

export class CreatePhysicalProductDto extends CreateProductBaseDto {
  // These are optional because The Service layer enforces presence for PUBLISHED items.

  @ApiPropertyOptional({ type: [VariantGroupDto], description: 'Max 2 groups' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantGroupDto)
  variantGroups?: VariantGroupDto[];

  @ApiPropertyOptional({ type: [SkuDto], description: 'Prices per variant combination' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkuDto)
  skus?: SkuDto[];

  @ApiPropertyOptional({ type: DimensionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @ApiPropertyOptional({ enum: ShippingMethod })
  @IsOptional()
  @IsEnum(ShippingMethod)
  shippingMethod?: ShippingMethod;
}