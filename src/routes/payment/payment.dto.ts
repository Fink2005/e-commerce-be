// src/payment/dto/create-payment-transaction.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { z } from 'zod';

export const createPaymentTransactionSchema = z.object({
  gateway: z.string().min(1, 'Gateway is required'),
  transactionDate: z.string().datetime('Invalid date format'),
  accountNumber: z.string().min(1, 'Account number is required'),
  code: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  amountIn: z.number().int().positive('Amount must be positive'),
  amountOut: z.number().int().positive('Amount must be positive'),
  accumulated: z.number().positive('Accumulated amount must be positive'),
  subAccount: z.string().optional(),
  transactionContent: z.string().min(1, 'Transaction content is required'),
  referenceNumber: z
    .number()
    .int()
    .positive('Reference number must be positive'),
  description: z
    .array(z.string())
    .min(1, 'At least one description is required'),
  status: z.nativeEnum(PaymentStatus).optional().default(PaymentStatus.PENDING),
  orderId: z.number().int().positive('Order ID must be positive'),
});

export class CreatePaymentTransactionDto {
  @ApiProperty({
    description: 'Payment gateway name',
    example: 'VNPay',
  })
  gateway: string;

  @ApiProperty({
    description: 'Transaction date in ISO format',
    example: '2024-01-15T10:30:00Z',
  })
  transactionDate: string;

  @ApiProperty({
    description: 'Account number for the transaction',
    example: '1234567890',
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Transaction code',
    example: 'TXN001',
    required: false,
  })
  code?: string;

  @ApiProperty({
    description: 'Transaction content/description',
    example: 'Payment for order #12345',
  })
  content: string;

  @ApiProperty({
    description: 'Amount in cents',
    example: 100000,
  })
  amountIn: number;
  @ApiProperty({
    description: 'Amount in cents',
    example: 100000,
  })
  amountOut: number;

  @ApiProperty({
    description: 'Accumulated amount',
    example: 1000.5,
  })
  accumulated: number;

  @ApiProperty({
    description: 'Sub account identifier',
    example: 'SUB001',
    required: false,
  })
  subAccount?: string;

  @ApiProperty({
    description: 'Detailed transaction content',
    example: 'Payment processed successfully',
  })
  transactionContent: string;

  @ApiProperty({
    description: 'Reference number for the transaction',
    example: 123456789,
  })
  referenceNumber: number;

  @ApiProperty({
    description: 'Array of transaction descriptions',
    example: ['Payment received', 'Order confirmed'],
    type: [String],
  })
  description: string[];

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    required: false,
    default: PaymentStatus.PENDING,
  })
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Related order ID',
    example: 1,
  })
  orderId: number;
}

export type CreatePaymentTransactionDtoType = z.infer<
  typeof createPaymentTransactionSchema
>;

// src/payment/dto/update-payment-transaction.dto.ts
export const updatePaymentTransactionSchema =
  createPaymentTransactionSchema.partial();

export class UpdatePaymentTransactionDto {
  @ApiProperty({
    description: 'Payment gateway name',
    example: 'VNPay',
    required: false,
  })
  gateway?: string;

  @ApiProperty({
    description: 'Transaction date in ISO format',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  transactionDate?: string;

  @ApiProperty({
    description: 'Account number for the transaction',
    example: '1234567890',
    required: false,
  })
  accountNumber?: string;

  @ApiProperty({
    description: 'Transaction code',
    example: 'TXN001',
    required: false,
  })
  code?: string;

  @ApiProperty({
    description: 'Transaction content/description',
    example: 'Payment for order #12345',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: 'Amount in cents',
    example: 100000,
    required: false,
  })
  amountIn?: number;

  @ApiProperty({
    description: 'Accumulated amount',
    example: 1000.5,
    required: false,
  })
  accumulated?: number;

  @ApiProperty({
    description: 'Sub account identifier',
    example: 'SUB001',
    required: false,
  })
  subAccount?: string;

  @ApiProperty({
    description: 'Detailed transaction content',
    example: 'Payment processed successfully',
    required: false,
  })
  transactionContent?: string;

  @ApiProperty({
    description: 'Reference number for the transaction',
    example: 123456789,
    required: false,
  })
  referenceNumber?: number;

  @ApiProperty({
    description: 'Array of transaction descriptions',
    example: ['Payment received', 'Order confirmed'],
    type: [String],
    required: false,
  })
  description?: string[];

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    required: false,
  })
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Related order ID',
    example: 1,
    required: false,
  })
  orderId?: number;
}

export type UpdatePaymentTransactionDtoType = z.infer<
  typeof updatePaymentTransactionSchema
>;

// src/payment/dto/payment-query.dto.ts
export const paymentQuerySchema = z.object({
  orderId: z.coerce.number().int().positive().optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export class PaymentQueryDto {
  @ApiProperty({
    description: 'Filter by order ID',
    example: 1,
    required: false,
  })
  orderId?: number;

  @ApiProperty({
    description: 'Filter by payment status',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    required: false,
  })
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Filter from date (ISO format)',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  fromDate?: string;

  @ApiProperty({
    description: 'Filter to date (ISO format)',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  toDate?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  limit?: number;
}

export type PaymentQueryDtoType = z.infer<typeof paymentQuerySchema>;
