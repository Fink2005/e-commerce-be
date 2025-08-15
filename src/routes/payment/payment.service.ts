// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  // async create(createPaymentTransactionDto: CreatePaymentTransactionDto) {
  //   const paymentId = createPaymentTransactionDto.code?.split('PTS')[1];
  //   // Verify that the order exists
  //   const order = await this.prisma.orders.findUnique({
  //     where: { id: createPaymentTransactionDto.orderId },
  //   });

  //   if (!order) {
  //     throw new NotFoundException(
  //       `Order with ID ${createPaymentTransactionDto.orderId} not found`,
  //     );
  //   }

  //   // Create the payment transaction
  //   const paymentTransaction = await this.prisma.payment_transactions.create({
  //     data: {
  //       ...createPaymentTransactionDto,
  //       updatedAt: new Date(),
  //       transactionDate: new Date(createPaymentTransactionDto.transactionDate),
  //       accumulated: createPaymentTransactionDto.accumulated,
  //       amountOut: createPaymentTransactionDto.amountOut || 0, // Ensure amountOut is provided
  //     },
  //     include: {
  //       orders: {
  //         include: {
  //           users: true,
  //           order_items: {
  //             include: {
  //               Product: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   // If payment is completed, update order status
  //   if (createPaymentTransactionDto.status === PaymentStatus.COMPLETED) {
  //     await this.updateOrderStatusAfterPayment(
  //       createPaymentTransactionDto.orderId,
  //     );
  //   }

  //   return paymentTransaction;
  // }

  // async findAll(query: PaymentQueryDto) {
  //   const { orderId, status, fromDate, toDate, page = 1, limit = 10 } = query;
  //   const skip = (page - 1) * limit;

  //   const where: any = {};

  //   if (orderId) {
  //     where.orderId = orderId;
  //   }

  //   if (status) {
  //     where.status = status;
  //   }

  //   if (fromDate || toDate) {
  //     where.transactionDate = {};
  //     if (fromDate) {
  //       where.transactionDate.gte = new Date(fromDate);
  //     }
  //     if (toDate) {
  //       where.transactionDate.lte = new Date(toDate);
  //     }
  //   }

  //   const [transactions, total] = await Promise.all([
  //     this.prisma.payment_transactions.findMany({
  //       where,
  //       skip,
  //       take: limit,
  //       orderBy: { createdAt: 'desc' },
  //       include: {
  //         orders: {
  //           include: {
  //             users: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 email: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     }),
  //     this.prisma.payment_transactions.count({ where }),
  //   ]);

  //   return {
  //     data: transactions,
  //     meta: {
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //     },
  //   };
  // }

  // async findOne(id: number) {
  //   const paymentTransaction = await this.prisma.pay.findUnique({
  //     where: { id },
  //     include: {
  //       order: {
  //         include: {
  //           user: {
  //             select: {
  //               id: true,
  //               name: true,
  //               email: true,
  //             },
  //           },
  //           orderItems: {
  //             include: {
  //               product: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   if (!paymentTransaction) {
  //     throw new NotFoundException(
  //       `Payment transaction with ID ${id} not found`,
  //     );
  //   }

  //   return paymentTransaction;
  // }

  // async findByOrderId(orderId: number) {
  //   const order = await this.prisma.order.findUnique({
  //     where: { id: orderId },
  //   });

  //   if (!order) {
  //     throw new NotFoundException(`Order with ID ${orderId} not found`);
  //   }

  //   return this.prisma.paymentTransaction.findMany({
  //     where: { orderId },
  //     orderBy: { createdAt: 'desc' },
  //     include: {
  //       order: {
  //         include: {
  //           user: {
  //             select: {
  //               id: true,
  //               name: true,
  //               email: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  // async update(
  //   id: number,
  //   updatePaymentTransactionDto: UpdatePaymentTransactionDto,
  // ) {
  //   const existingTransaction = await this.prisma.paymentTransaction.findUnique(
  //     {
  //       where: { id },
  //     },
  //   );

  //   if (!existingTransaction) {
  //     throw new NotFoundException(
  //       `Payment transaction with ID ${id} not found`,
  //     );
  //   }

  //   const updateData: any = { ...updatePaymentTransactionDto };

  //   if (updatePaymentTransactionDto.transactionDate) {
  //     updateData.transactionDate = new Date(
  //       updatePaymentTransactionDto.transactionDate,
  //     );
  //   }

  //   const updatedTransaction = await this.prisma.paymentTransaction.update({
  //     where: { id },
  //     data: updateData,
  //     include: {
  //       order: {
  //         include: {
  //           user: true,
  //           orderItems: {
  //             include: {
  //               product: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   // If payment status changed to completed, update order status
  //   if (
  //     updatePaymentTransactionDto.status === PaymentStatus.COMPLETED &&
  //     existingTransaction.status !== PaymentStatus.COMPLETED
  //   ) {
  //     await this.updateOrderStatusAfterPayment(updatedTransaction.orderId);
  //   }

  //   return updatedTransaction;
  // }

  // async remove(id: number) {
  //   const paymentTransaction = await this.prisma.paymentTransaction.findUnique({
  //     where: { id },
  //   });

  //   if (!paymentTransaction) {
  //     throw new NotFoundException(
  //       `Payment transaction with ID ${id} not found`,
  //     );
  //   }

  //   return this.prisma.paymentTransaction.delete({
  //     where: { id },
  //   });
  // }

  // async getPaymentStats(fromDate?: string, toDate?: string) {
  //   const where: any = {};

  //   if (fromDate || toDate) {
  //     where.transactionDate = {};
  //     if (fromDate) {
  //       where.transactionDate.gte = new Date(fromDate);
  //     }
  //     if (toDate) {
  //       where.transactionDate.lte = new Date(toDate);
  //     }
  //   }

  //   const [totalTransactions, completedPayments, failedPayments, totalAmount] =
  //     await Promise.all([
  //       this.prisma.paymentTransaction.count({ where }),
  //       this.prisma.paymentTransaction.count({
  //         where: { ...where, status: PaymentStatus.COMPLETED },
  //       }),
  //       this.prisma.paymentTransaction.count({
  //         where: { ...where, status: PaymentStatus.FAILED },
  //       }),
  //       this.prisma.paymentTransaction.aggregate({
  //         where: { ...where, status: PaymentStatus.COMPLETED },
  //         _sum: { amountIn: true },
  //       }),
  //     ]);

  //   return {
  //     totalTransactions,
  //     completedPayments,
  //     failedPayments,
  //     pendingPayments: totalTransactions - completedPayments - failedPayments,
  //     totalAmount: totalAmount._sum.amountIn || 0,
  //   };
  // }

  // private async updateOrderStatusAfterPayment(orderId: number) {
  //   const order = await this.prisma.order.findUnique({
  //     where: { id: orderId },
  //     include: {
  //       paymentTransactions: true,
  //     },
  //   });

  //   if (!order) return;

  //   const totalPaid = order.paymentTransactions
  //     .filter((tx) => tx.status === PaymentStatus.COMPLETED)
  //     .reduce((sum, tx) => sum + tx.amountIn, 0);

  //   const orderTotal = Number(order.totalAmount) * 100; // Convert to cents

  //   if (totalPaid >= orderTotal && order.status === OrderStatus.PENDING) {
  //     await this.prisma.order.update({
  //       where: { id: orderId },
  //       data: { status: OrderStatus.CONFIRMED },
  //     });
  //   }
  // }
}
