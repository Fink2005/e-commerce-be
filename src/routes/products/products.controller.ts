import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BundleCreateDTO, PhoneDTO } from 'src/routes/products/products.dto';
import { ProductsService } from 'src/routes/products/products.service';
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get('phone')
  @ApiOperation({ summary: 'Get all phone products' })
  @ApiResponse({ status: 200, type: PhoneDTO })
  async getProducts() {
    return await this.productService.getProducts();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new bundle (phone + package)' })
    @ApiResponse({ status: 201, type: BundleCreateDTO })
    async createBundleProduct(@Body() body: BundleCreateDTO) {
    return await this.productService.createPhoneProduct(body);
    }
    
}
