import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateDigitalProductDto } from './dto/create-digital-product.dto';

@ApiTags('Product')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('digital')
  @ApiOperation({
    summary: 'Create Digital Product',
    description: 'Creates a digital product (e.g., E-books, Software). Requires Price and Quantity if Published.',
  })
  @ApiBody({ type: CreateDigitalProductDto })
  @ApiResponse({ status: 201, description: 'Digital Product created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  createDigital(@Body() dto: CreateDigitalProductDto) {
    return this.productsService.createDigital(dto);
  }
}