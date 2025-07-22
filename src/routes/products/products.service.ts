import { Injectable } from '@nestjs/common';
import { BundleCreateDTO } from 'src/routes/products/products.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService) {
    }
    async getProducts() {
        return await this.prismaService.phone.findMany()
    }
    async createPhoneProduct(body: BundleCreateDTO) {
        const phone = await this.prismaService.bundle.create({
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
            data: phone
        }
    }
}
