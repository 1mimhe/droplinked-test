import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@ApiTags('Collection')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new collection',
    description: 'Create a product collection to organize products'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Collection created successfully'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data' 
  })
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all collections',
    description: 'Retrieve all collections, optionally filtered by merchant'
  })
  @ApiQuery({ 
    name: 'merchantId', 
    required: false, 
    description: 'Filter collections by merchant ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Collections retrieved successfully'
  })
  findAll(@Query('merchantId') merchantId?: string) {
    return this.collectionsService.findAll(merchantId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get collection by ID',
    description: 'Retrieve a specific collection with full details'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Collection MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Collection found'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Collection not found' 
  })
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update collection',
    description: 'Update collection details'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Collection ID to update'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Collection updated successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Collection not found' 
  })
  update(
    @Param('id') id: string, 
    @Body() updateCollectionDto: UpdateCollectionDto
  ) {
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete collection',
    description: 'Permanently delete a collection'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Collection ID to delete'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Collection deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Collection not found' 
  })
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
}
