import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@ApiTags('Collections')
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
}
