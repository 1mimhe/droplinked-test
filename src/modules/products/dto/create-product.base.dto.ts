import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ProductStatus, ProductVisibility } from '../../../common/enums/product.enums';

export class CreateProductBaseDto {
  @ApiProperty({ 
    example: 'Awesome Product', 
    description: 'Product Title (Required for Draft & Publish)' 
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({ example: 'Detailed description...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    example: ['https://example.com/img.jpg'], 
    description: 'Array of Image URLs' 
  })
  @IsOptional()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({ 
    enum: ProductStatus, 
    default: ProductStatus.DRAFT,
    description: 'Draft requires minimal fields. Published requires all.'
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus = ProductStatus.DRAFT;

  @ApiProperty({ 
    enum: ProductVisibility, 
    default: ProductVisibility.PRIVATE 
  })
  @IsEnum(ProductVisibility)
  @IsOptional()
  visibility?: ProductVisibility = ProductVisibility.PRIVATE;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'Merchant ID who owns this collection'
  })
  @IsMongoId()
  merchantId: string;

  @ApiProperty({ example: '60d5ecb8b392d7001f4e3b11', description: 'Collection ID' })
  @IsMongoId()
  collectionId: string;
}