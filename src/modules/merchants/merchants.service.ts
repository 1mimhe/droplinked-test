import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Merchant, MerchantDocument } from './schemas/merchant.schema';
import { CreateMerchantDto } from './dto/create-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectModel(Merchant.name)
    private merchantModel: Model<MerchantDocument>,
  ) {}

  async create(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    const existingMerchant = await this.merchantModel.findOne({ 
      email: createMerchantDto.email 
    });
    
    if (existingMerchant) {
      throw new ConflictException('Merchant with this email already exists.');
    }

    const newMerchant = new this.merchantModel(createMerchantDto);
    return newMerchant.save();
  }

  async findAll(): Promise<Merchant[]> {
    return this.merchantModel.find().exec();
  }

  async findOne(id: string): Promise<Merchant> {
    const merchant = await this.merchantModel.findById(id).exec();
    
    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }
    
    return merchant;
  }
}
