// product-create.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { DeviceType, PackageType, ProductType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// ✅ Đây là phần schema bạn nên dùng
export const ProductCreateSchema = z
  .object({
    name: z.string().nonempty(),
    description: z.string().nullable(),
    price: z.number().positive(),
    rating: z.number().min(0).max(5).nullable(),
    isActive: z.boolean().default(true),
    imgUrl: z.string().url(),
    type: z.nativeEnum(ProductType),
    packageType: z.nativeEnum(PackageType),
    deviceType: z.nativeEnum(DeviceType),
    bundleItems: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          quantity: z.number().int().min(1),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'BUNDLE') return data.bundleItems?.length;
      return !data.bundleItems;
    },
    {
      message:
        'bundleItems must be present only for type=BUNDLE and must have at least one item',
      path: ['bundleItems'],
    },
  );

export class ProductCreateDTO extends createZodDto(ProductCreateSchema) {
  @ApiProperty({ example: 'Galaxy Fold 7' })
  name: string;

  @ApiProperty({ example: 'Powerful Android device' })
  description: string | null;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 4.5 })
  rating: number | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  imgUrl: string;

  @ApiProperty({ enum: ProductType })
  type: ProductType;

  @ApiProperty({ enum: PackageType })
  packageType: PackageType;

  @ApiProperty({ enum: DeviceType })
  deviceType: DeviceType;
}

const BundleItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

export const BundleCreateSchema = z.object({
  name: z.string().nonempty(),
  description: z.string(),
  imgUrl: z.string().url(),
  price: z.number().positive(),
  rating: z.number().min(0).max(5),
  isActive: z.boolean().default(true),

  bundleItems: z
    .array(BundleItemSchema)
    .min(1, 'At least one item is required'),
});

export class BundleCreateDTO extends createZodDto(BundleCreateSchema) {
  @ApiProperty({ example: 'Combo Bundle' })
  name: string;

  @ApiProperty({ example: 'A great deal of products' })
  description: string;

  @ApiProperty({ example: 'https://example.com/bundle.jpg' })
  imgUrl: string;

  @ApiProperty({ example: 1499.0 })
  price: number;

  @ApiProperty({ example: 4.8 })
  rating: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({
    example: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ],
  })
  bundleItems: { productId: number; quantity: number }[];
}

export class BundleItemResDTO {
  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({
    example: {
      id: 1,
      name: 'iPhone 15',
      description: 'Latest iPhone',
      price: 999,
      rating: 5,
      isActive: true,
      imgUrl: 'https://example.com/iphone.jpg',
      type: ProductType.PHONE,
      packageType: PackageType.MOBILE,
      deviceType: DeviceType.MOBILE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  product: any; // hoặc tạo thêm ProductNestedResDTO nếu muốn rõ ràng hơn
}
export class ProductResDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Galaxy Fold 7' })
  name: string;

  @ApiProperty({ example: 'Latest foldable phone from Samsung' })
  description: string;

  @ApiProperty({ example: 1200.5 })
  price: number;

  @ApiProperty({ example: 4.5 })
  rating: number | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'https://example.com/phone.jpg' })
  imgUrl: string | null;

  // @ApiProperty({ enum: ProductType, example: ProductType.BUNDLE })
  // type: ProductType;

  // @ApiProperty({ enum: PackageType, example: PackageType.MOBILE })
  // packageType: PackageType | null;

  // @ApiProperty({ enum: DeviceType, example: DeviceType.MOBILE })
  // deviceType: DeviceType | null;

  @ApiProperty({ type: [BundleItemResDTO], required: false })
  bundleItems?: BundleItemResDTO[];

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
}
