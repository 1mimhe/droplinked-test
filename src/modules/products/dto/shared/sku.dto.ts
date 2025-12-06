import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SkuDto {
  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ example: 'EXT-SKU-001' })
  @IsOptional()
  @IsString()
  externalId?: string;
  
  @ApiPropertyOptional({ 
    example: { Color: 'Red', Size: 'Large' },
    description: 'Variant combination (auto-filled by system), but you can override it.'
  })
  @IsOptional()
  variantCombination: string[];
}