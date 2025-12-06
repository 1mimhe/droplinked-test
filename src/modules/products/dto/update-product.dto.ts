import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsMongoId } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePhysicalProductDto } from './create-physical-product.dto';
import { CreateDigitalProductDto } from './create-digital-product.dto';

export class UpdatePhysicalProductDto extends PartialType(CreatePhysicalProductDto) {
  @ApiPropertyOptional({
    description: 'Merchant ID (optional for updates)',
    example: '507f1f77bcf86cd799439011'
  })
  @IsOptional()
  @IsMongoId()
  merchantId?: string;
}

export class UpdateDigitalProductDto extends PartialType(CreateDigitalProductDto) {
  @ApiPropertyOptional({
    description: 'Merchant ID (optional for updates)',
    example: '507f1f77bcf86cd799439011'
  })
  @IsOptional()
  @IsMongoId()
  merchantId?: string;
}