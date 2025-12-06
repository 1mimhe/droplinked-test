import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductBaseDto } from './create-product.base.dto';

class DeliveryInfoDto {
  @ApiPropertyOptional({ example: 'Thank you for downloading!' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'https://download.com/file.zip' })
  @IsOptional()
  @IsUrl()
  url?: string;
}

export class CreateDigitalProductDto extends CreateProductBaseDto {
  // These are optional because The Service layer enforces presence for PUBLISHED items.

  @ApiPropertyOptional({ example: 19.99, description: 'Required for Published' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 999, description: 'Required for Published' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 'EXT-DIG-001' })
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional({ type: DeliveryInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryInfoDto)
  deliveryInfo?: DeliveryInfoDto;
}