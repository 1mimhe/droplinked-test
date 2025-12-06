import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateDigitalProductDto } from './dto/create-digital-product.dto';
import { UpdateDigitalProductDto } from './dto/update-product.dto';
import { ProductStatus, ProductType } from 'src/common/enums/product.enums';

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

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve all products (both Digital and Physical) with optional filters.',
  })
  @ApiQuery({ name: 'merchantId', required: false, example: '60d5ecb8b392d7001f4e3b11' })
  @ApiQuery({ name: 'type', enum: ProductType, required: false })
  @ApiQuery({ name: 'status', enum: ProductStatus, required: false })
  findAll(
    @Query('merchantId') merchantId?: string,
    @Query('type', new ParseEnumPipe(ProductType, { optional: true })) type?: ProductType,
    @Query('status', new ParseEnumPipe(ProductStatus, { optional: true })) status?: ProductStatus,
  ) {
    return this.productsService.findAll({ merchantId, type, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
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