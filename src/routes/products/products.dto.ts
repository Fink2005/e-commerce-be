import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const PhoneSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  brand: z.string().nonempty({ message: 'Brand is required' }),
  price: z
    .number()
    .nonnegative({ message: 'Price must be a non-negative number' }),
  imgUrl: z.string().nonempty({ message: 'Image URL is required' }),
  isActive: z.boolean(),
  rating: z.number().min(0).max(5).nullable(),
  description: z.string().nullable(),
  stock: z
    .number()
    .nonnegative({ message: 'Stock must be a non-negative number' }),
});

const BundleItemResponseSchema = z.object({
  id: z.number(),
  bundleId: z.number(),
  phoneId: z.number().nullable(),
  packageId: z.number().nullable(),
  quantity: z.number(),
  phone: z
    .object({
      id: z.number(),
      name: z.string(),
      brand: z.string(),
      price: z.number(),
      rating: z.number().nullable(),
      imgUrl: z.string(),
      description: z.string().nullable(),
      stock: z.number(),
      isActive: z.boolean(),
    })
    .nullable()
    .optional(),
  package: z
    .object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      price: z.number(),
      rating: z.number().nullable(),
      isActive: z.boolean(),
    })
    .nullable()
    .optional(),
});

const PackageSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Package name is required').max(255),
  description: z.string().nullable(),
  type: z.string().default('PACKAGE'), // Default type is MOBILE
  PackageType: z
    .enum(['MOBILE', 'BROADBAND', 'TABLET', 'COMBO'])
    .default('MOBILE'),
  price: z.number().positive('Price must be positive'),
  rating: z.number().min(0).max(5).nullable(),
  isActive: z.boolean().default(true),
});

const BundleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  rating: z.number().min(0).max(5).nullable(),
  isActive: z.boolean(),
  type: z.string().default('BUNDLE'),
  createdAt: z.date(),
  updatedAt: z.date(),
  bundleItems: z.array(BundleItemResponseSchema).optional(),
});

const BundleItemSchema = z
  .object({
    phoneId: z.number().int().positive().optional(),
    packageId: z.number().int().positive().optional(),
    quantity: z.number().int().min(1).default(1),
  })
  .refine((data) => data.phoneId || data.packageId, {
    message: 'Either phoneId or packageId must be provided',
    path: ['phoneId', 'packageId'],
  });

const CreateBundleSchema = z.object({
  name: z.string().min(1, 'Bundle name is required').max(255),
  description: z.string().max(1000).optional(),
  price: z.number().positive('Price must be positive'),
  rating: z.number().min(0).max(5).optional(),
  isActive: z.boolean().default(true),
  bundleItems: z
    .array(BundleItemSchema)
    .min(1, 'At least one bundle item is required'),
});

const OfferCategorySchema = z.enum(['HEAVY', 'MEDIUM', 'LIGHT']);

const SpecialOfferQuerySchema = z.object({
  userId: z.number().int().positive().optional(),
  category: OfferCategorySchema.optional(),
  discount: z.number().int().min(0).max(999).optional(),
  phoneId: z.number().int().positive().optional(),
  packageId: z.number().int().positive().optional(),
  bundleId: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export class BundleCreateDTO extends createZodDto(CreateBundleSchema) {
  @ApiProperty({ example: 'Premium Bundle' }) name: string;
  @ApiProperty({
    example: 'A premium bundle with the latest phones and packages.',
  })
  @ApiProperty({
    example: [
      {
        phoneId: 1,
        packageId: null,
        quantity: 2,
      },
      {
        phoneId: null,
        packageId: 3,
        quantity: 1,
      },
    ],
  })
  bundleItems: z.infer<typeof BundleItemSchema>[];
  @ApiProperty({ example: 1999.99 }) price: number;
  @ApiProperty({ example: 4.5 }) rating: number;
  @ApiProperty({ example: true }) isActive: boolean;
}

export class BundleResDTO extends createZodDto(BundleResponseSchema) {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'Premium Bundle' }) name: string;
  @ApiProperty({
    example: 'A premium bundle with the latest phones and packages.',
  })
  @ApiProperty({ example: 'A luxurious bundle designed for tech enthusiasts.' })
  description: string | null;
  @ApiProperty({ example: 1999.99 }) price: number;
  @ApiProperty({ example: 4.5 }) rating: number | null;
  @ApiProperty({ example: true }) isActive: boolean;
  @ApiProperty({ type: [Object] }) bundleItems?: z.infer<
    typeof BundleItemResponseSchema
  >[];
}

export class PhoneCreateDTO extends createZodDto(PhoneSchema) {
  @ApiProperty({ example: 'Galaxy fold 7' }) name: string;
  @ApiProperty({ example: 'Samsung' }) brand: string;
  @ApiProperty({ example: 999.99 }) price: number;
  @ApiProperty({
    example:
      'https://imgs.search.brave.com/koQZ8pQqmVhUNwGBHpocn9sVZ_imvxaJRQ6nZrcHuV4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZWxl/YmppaGFkLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNS8w/Ny90X2p1bGlhX3Bh/cnRvbl9udWRlX3Bh/c3Npb25fYmVmb3Jl/X21pZG5pZ2h0Mi0z/MTB4MzEwLmpwZw',
  })
  imgUrl: string;
  @ApiProperty({
    example: 'A high-performance foldable phone with cutting-edge features.',
  })
  description: string | null;
  @ApiProperty({ example: true }) isActive: boolean;
  @ApiProperty({
    example: 'Latest Samsung Galaxy fold with advanced features.',
  })
  @ApiProperty({ example: 4.8 })
  rating: number | null;
  @ApiProperty({ example: 50 }) stock: number;
}
export class PhoneResDTO extends createZodDto(PhoneSchema) {
  @ApiProperty({ example: 'Galaxy fold 7' }) name: string;
  @ApiProperty({
    example: 'A high-performance foldable phone with cutting-edge features.',
  })
  @ApiProperty({ example: 'Samsung' })
  brand: string;
  @ApiProperty({ example: 999.99 }) price: number;
  @ApiProperty({
    example:
      'https://imgs.search.brave.com/koQZ8pQqmVhUNwGBHpocn9sVZ_imvxaJRQ6nZrcHuV4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZWxl/YmppaGFkLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNS8w/Ny90X2p1bGlhX3Bh/cnRvbl9udWRlX3Bh/c3Npb25fYmVmb3Jl/X21pZG5pZ2h0Mi0z/MTB4MzEwLmpwZw',
  })
  imgUrl: string;
  @ApiProperty({ example: true }) isActive: boolean;
  @ApiProperty({
    example: 'Latest Samsung Galaxy fold with advanced features.',
  })
  description: string | null;
  @ApiProperty({ example: 4.8 }) rating: number | null;
  @ApiProperty({ example: 50 }) stock: number;
}

export class PackageResDTO extends createZodDto(PackageSchema) {
  @ApiProperty({ example: 'Unlimited Data Plan' }) name: string;
  @ApiProperty({ example: 'A comprehensive data plan with unlimited access.' })
  @ApiProperty({ example: 49.99 })
  price: number;
  @ApiProperty({
    example: 'A high-performance foldable phone with cutting-edge features.',
  })
  description: string | null;
  @ApiProperty({ example: 4.8 })
  rating: number | null;
  @ApiProperty({ example: true }) isActive: boolean;
}
const CreatePackageSchema = PackageSchema.omit({ id: true, type: true });

export class CreatePackageDTO extends createZodDto(CreatePackageSchema) {
  @ApiProperty({ example: 'Unlimited Data Plan' }) name: string;
  @ApiProperty({ example: 'A comprehensive data plan with unlimited access.' })
  @ApiProperty({ example: 49.99 })
  price: number;
  @ApiProperty({
    example: 'A high-performance foldable phone with cutting-edge features.',
  })
  description: string | null;
  @ApiProperty({ example: 4.8 })
  rating: number | null;
  @ApiProperty({ example: true }) isActive: boolean;
}

export class SpecialOfferQueryDTO extends createZodDto(
  SpecialOfferQuerySchema,
) {}
