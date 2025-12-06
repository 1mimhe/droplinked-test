import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({ 
    example: 'John Doe Store',
    description: 'Name of the merchant store'
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ 
    example: 'john@example.com',
    description: 'Unique email address'
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ 
    example: '+1234567890',
    description: 'Contact phone number'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    example: 'My awesome store description',
    description: 'Store description'
  })
  @IsOptional()
  @IsString()
  description?: string;
}