import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PhysicalProduct, PhysicalProductSchema } from './schemas/physical-product.schema';
import { DigitalProduct, DigitalProductSchema } from './schemas/digital-product.schema';
import { Product, ProductSchema } from './schemas/product.base.schema';
import { ProductType } from 'src/common/enums/product.enums';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
        discriminators: [
          { 
            name: DigitalProduct.name, 
            schema: DigitalProductSchema,
            value: ProductType.DIGITAL
          },
          { 
            name: PhysicalProduct.name, 
            schema: PhysicalProductSchema,
            value: ProductType.PHYSICAL
          },
        ],
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
