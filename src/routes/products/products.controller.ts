import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import {
  BundleCreateDTO,
  BundleResDTO,
  CreatePackageDTO,
  PackageResDTO,
  PhoneCreateDTO,
  PhoneResDTO,
} from 'src/routes/products/products.dto';
import { ProductsService } from 'src/routes/products/products.service';
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'productType', enum: ProductType, required: false }) // 👈 This defines `type` in Swagger
  @ApiResponse({ status: 200, type: PhoneResDTO })
  async getProducts(@Query('productType') productType: ProductType) {
    return await this.productService.getProducts(productType);
  }
  // create bundle
  @Post('bundle')
  @ApiOperation({ summary: 'Create a new bundle (phone + package)' })
  @ApiResponse({ status: 201, type: BundleCreateDTO })
  async createBundleProduct(@Body() body: BundleCreateDTO) {
    return await this.productService.createBundleProduct(body);
  }

  //  create phone
  @Post('phone')
  @ApiOperation({ summary: 'Create a new phone' })
  @ApiResponse({ status: 201, type: PhoneResDTO })
  async createPhoneProduct(@Body() body: PhoneCreateDTO) {
    return await this.productService.createPhoneProduct(body);
  }

  // create package
  @Post('package')
  @ApiOperation({ summary: 'Create a new package' })
  @ApiResponse({ status: 201, type: PackageResDTO })
  async createPackageProduct(@Body() body: CreatePackageDTO) {
    return await this.productService.createPackageProduct(body);
  }

  @Get(':productType/:productId')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(BundleResDTO) },
        { $ref: getSchemaPath(PhoneResDTO) },
        { $ref: getSchemaPath(PackageResDTO) },
      ],
    },
  })
  async getProductById(
    @Param('productType') productType: ProductType,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<PhoneResDTO | BundleResDTO | PackageResDTO | null> {
    return await this.productService.getProductById(productType, productId);
  }
}
