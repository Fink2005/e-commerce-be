import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import {
  ProductCreateDTO,
  ProductResDTO,
} from 'src/routes/products/products.dto';
import { ProductsService } from 'src/routes/products/products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'productType', enum: ProductType, required: false })
  @ApiResponse({ status: 200, type: [ProductResDTO] })
  async getProducts(@Query('productType') productType: ProductType) {
    return await this.productService.getProducts(productType);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product (phone, package, or bundle)' })
  @ApiResponse({ status: 201, type: ProductResDTO })
  async createProduct(@Body() body: ProductCreateDTO) {
    return await this.productService.createProduct(body);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, type: ProductResDTO })
  async getProductById(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductResDTO | null> {
    return await this.productService.getProductById(productId);
  }
}
