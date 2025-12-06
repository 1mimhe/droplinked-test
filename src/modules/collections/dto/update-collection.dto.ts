import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class UpdateCollectionDto {
  @ApiPropertyOptional({ 
    example: 'Updated Collection Name',
    minLength: 2
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ 
    example: 'Updated description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
