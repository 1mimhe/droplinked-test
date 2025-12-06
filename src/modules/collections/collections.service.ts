import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Collection, CollectionDocument } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private collectionModel: Model<CollectionDocument>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    const collection = new this.collectionModel(createCollectionDto);
    return collection.save();
  }

  async findAll(merchantId?: string): Promise<Collection[]> {
    const query = merchantId 
      ? { merchantId: new Types.ObjectId(merchantId) } 
      : {};
    
    return this.collectionModel
      .find(query)
      .populate('merchantId')
      .exec();
  }

  async findOne(id: string): Promise<Collection> {
    const collection = await this.collectionModel
      .findById(id)
      .populate('merchantId')
      .exec();

    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }

    return collection;
  }

  async update(
    id: string, 
    updateCollectionDto: UpdateCollectionDto
  ): Promise<Collection> {
    const updated = await this.collectionModel
      .findByIdAndUpdate(id, updateCollectionDto, { new: true })
      .populate('merchantId')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.collectionModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }
  }
}
