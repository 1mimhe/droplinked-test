import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class DimensionsDto {
  @ApiProperty({ example: 10, description: 'Length' })
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty({ example: 5, description: 'Width' })
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({ example: 3, description: 'Height' })
  @IsNumber()
  @Min(0)
  height: number;

  @ApiPropertyOptional({ example: 'cm', default: 'cm' })
  @IsOptional()
  @IsString()
  unit?: string = 'cm';

  @ApiProperty({ example: 0.5, description: 'Weight' })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiPropertyOptional({ example: 'kg', default: 'kg' })
  @IsOptional()
  @IsString()
  weightUnit?: string = 'kg';
}