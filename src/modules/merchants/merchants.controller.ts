import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';

@ApiTags('Merchant')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new merchant',
    description: 'Register a new merchant account in the system'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Merchant created successfully'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Merchant with this email already exists' 
  })
  create(@Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantsService.create(createMerchantDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all merchants',
    description: 'Retrieve a list of all registered merchants'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of merchants retrieved successfully'
  })
  findAll() {
    return this.merchantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get merchant by ID',
    description: 'Retrieve detailed information about a specific merchant'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB ObjectId of the merchant',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Merchant found and returned'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Merchant not found' 
  })
  findOne(@Param('id') id: string) {
    return this.merchantsService.findOne(id);
  }
}
