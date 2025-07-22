import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductType } from '@prisma/client';
import { BundleCreateDTO, CreatePackageDTO, PhoneCreateDTO } from 'src/routes/products/products.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService) {
    }
    async getProducts() {
        const [phonesResult, packageResult,  bundlesResult] = await Promise.allSettled([
            this.prismaService.phone.findMany(),
            this.prismaService.package.findMany(),
            this.prismaService.bundle.findMany()
        ]);

        return {
            phones: phonesResult.status === 'fulfilled' ? phonesResult.value : [],
            packages: packageResult.status === 'fulfilled' ? packageResult.value : [],
            bundles: bundlesResult.status === 'fulfilled' ? bundlesResult.value : []
        };
    }
    async getProductById(productType: string, productId: number) {
        switch (productType) {
            case ProductType.PHONE:
              return this.prismaService.phone.findUnique({ where: { id: productId } });
            case ProductType.PACKAGE:
              return this.prismaService.package.findUnique({ where: { id: productId } });
            case ProductType.BUNDLE:
              return this.prismaService.bundle.findUnique({
                where: { id: productId },
                include: {
                  bundleItems: {
                    include: {
                      phone: true,
                      package: true,
                    },
                  },
                },
              });
            default:
              throw new BadRequestException('Invalid product type');
          }
    }
    async createBundleProduct(body: BundleCreateDTO) {
        const bundle = await this.prismaService.bundle.create({
         data: {
            name: body.name,
            description: body.description,
            price: body.price,
            bundleItems: {
                create: body.bundleItems.map(item => ({
                    quantity: item.quantity,
                    packageId: item.packageId,
                    phoneId: item.phoneId
                }))
            }
         }
        });
        return {
            success: true,
            data: bundle
        }
    }
    async createPhoneProduct(body: PhoneCreateDTO) {
        const phone = await this.prismaService.phone.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                rating: body.rating,
                brand: body.brand,
                imgUrl: body.imgUrl,
                stock: body.stock,
                isActive: body.isActive
            }
        });
        return {
            success: true,
            data: phone
        };

    }
    async createPackageProduct(body: CreatePackageDTO) {
        console.log(body);
        const packageData = await this.prismaService.package.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                rating: body.rating,
                isActive: body.isActive
            }
        });
        return {
            success: true,
            data: packageData
        };
    }
}
