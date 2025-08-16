import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductType } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ProductCreateDTO } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(productType?: ProductType) {
    if (productType === ProductType.BUNDLE) {
      const bundles = await this.prisma.bundles.findMany({
        include: {
          bundle_items: {
            include: {
              Product: true,
            },
          },
        },
      });
      return bundles;
    } else if (productType === ProductType.ALL) {
      return await this.prisma.product.findMany();
    }
    return await this.prisma.product.findMany({
      where: {
        type: productType,
      },
    });
  }

  async getProductById(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new BadRequestException('Product not found');

    if (product.type === ProductType.BUNDLE) {
      const bundle = await this.prisma.bundles.findUnique({
        where: { id: productId }, // giả sử bạn dùng chung id, nếu không thì cần sửa
        include: {
          bundle_items: {
            include: {
              Product: true,
            },
          },
        },
      });

      if (!bundle) throw new BadRequestException('Bundle not found');
      return bundle;
    }

    return product;
  }

  async createProduct(body: ProductCreateDTO) {
    const { bundleItems, ...rest } = body;

    if (body.type === ProductType.BUNDLE) {
      if (!bundleItems || bundleItems.length === 0) {
        throw new BadRequestException('Bundle must have at least one item');
      }

      return await this.prisma.bundles.create({
        data: {
          name: rest.name,
          description: rest.description || '',
          imgUrl: rest.imgUrl,
          price: rest.price,
          rating: rest.rating,
          isActive: rest.isActive,
          bundle_items: {
            create: bundleItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });
    }
    return await this.prisma.product.create({
      data: {
        ...rest,
        updatedAt: new Date(),
        description: rest.description || '',
        rating: rest.rating || 0,
      },
    });
  }
}
