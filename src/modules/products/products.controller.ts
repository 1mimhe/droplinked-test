import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateDigitalProductDto } from './dto/create-digital-product.dto';
import { UpdateDigitalProductDto } from './dto/update-product.dto';

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

  @Patch('digital/:id')
  @ApiOperation({
    summary: 'Update Digital Product',
    description: 'Updates a digital product. If status is set to Published, full validation runs.',
  })
  @ApiParam({ name: 'id', example: '60d5ecb8b392d7001f4e3b11' })
  updateDigital(
    @Param('id') id: string, 
    @Body() dto: UpdateDigitalProductDto
  ) {
    return this.productsService.updateDigital(id, dto);
  }
}