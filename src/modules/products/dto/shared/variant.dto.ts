import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MinLength } from 'class-validator';

export class VariantValueDto {
  @ApiProperty({ example: 'Red' })
  @IsString()
  @MinLength(1)
  value: string;
}

export class VariantGroupDto {
  @ApiProperty({ example: 'Color' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ type: [String], example: ['Red', 'Blue'] })
  @IsArray()
  @IsString({ each: true })
  values: string[];
}