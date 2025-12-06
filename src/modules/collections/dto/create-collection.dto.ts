import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId, IsBoolean, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ 
    example: 'Summer Collection 2024',
    description: 'Name of the collection',
    minLength: 2
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ 
    example: 'Best products for summer season',
    description: 'Detailed description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'Merchant ID who owns this collection'
  })
  @IsMongoId()
  merchantId: string;

  @ApiPropertyOptional({ 
    example: true, 
    default: true,
    description: 'Active status'
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
