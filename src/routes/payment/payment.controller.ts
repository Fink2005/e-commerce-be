// src/payment/payment.controller.ts
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PaymentService } from './payment.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Role } from '@prisma/client';

@ApiTags('Payments')
@Controller('payments')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Post()
  // @ApiOperation({
  //   summary: 'Create payment transaction',
  //   description: 'Create a new payment transaction for an order',
  // })
  // @ApiBody({ type: CreatePaymentTransactionDto })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'Payment transaction created successfully',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       statusCode: { type: 'number', example: 201 },
  //       message: {
  //         type: 'string',
  //         example: 'Payment transaction created successfully',
  //       },
  //       data: { type: 'object' },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid input data',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Order not found',
  // })
  // // @UseGuards(RolesGuard)
  // // @Roles(Role.ADMIN)
  // @HttpCode(HttpStatus.CREATED)
  // async create(
  //   @Body() createPaymentTransactionDto: CreatePaymentTransactionDto,
  // ) {
  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: 'Payment transaction created successfully',
  //     data: await this.paymentService.create(createPaymentTransactionDto),
  //   };
  // }

  // @Get()
  // @ApiOperation({
  //   summary: 'Get all payment transactions',
  //   description: 'Retrieve payment transactions with filtering and pagination',
  // })
  // @ApiQuery({
  //   name: 'orderId',
  //   required: false,
  //   type: Number,
  //   description: 'Filter by order ID',
  // })
  // @ApiQuery({
  //   name: 'status',
  //   required: false,
  //   enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
  //   description: 'Filter by payment status',
  // })
  // @ApiQuery({
  //   name: 'fromDate',
  //   required: false,
  //   type: String,
  //   description: 'Filter from date (ISO format)',
  // })
  // @ApiQuery({
  //   name: 'toDate',
  //   required: false,
  //   type: String,
  //   description: 'Filter to date (ISO format)',
  // })
  // @ApiQuery({
  //   name: 'page',
  //   required: false,
  //   type: Number,
  //   description: 'Page number',
  //   example: 1,
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   type: Number,
  //   description: 'Items per page',
  //   example: 10,
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Payment transactions retrieved successfully',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       statusCode: { type: 'number', example: 200 },
  //       message: {
  //         type: 'string',
  //         example: 'Payment transactions retrieved successfully',
  //       },
  //       data: { type: 'array', items: { type: 'object' } },
  //       meta: {
  //         type: 'object',
  //         properties: {
  //           total: { type: 'number' },
  //           page: { type: 'number' },
  //           limit: { type: 'number' },
  //           totalPages: { type: 'number' },
  //         },
  //       },
  //     },
  //   },
  // })
  // // @UseGuards(RolesGuard)
  // // @Roles(Role.ADMIN)
  // async findAll(@Query() query: PaymentQueryDto) {
  //   const result = await this.paymentService.findAll(query);
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Payment transactions retrieved successfully',
  //     ...result,
  //   };
  // }

  // @Get('stats')
  // @ApiOperation({
  //   summary: 'Get payment statistics',
  //   description: 'Retrieve payment statistics with optional date filtering',
  // })
  // @ApiQuery({
  //   name: 'fromDate',
  //   required: false,
  //   type: String,
  //   description: 'Start date for statistics (ISO format)',
  // })
  // @ApiQuery({
  //   name: 'toDate',
  //   required: false,
  //   type: String,
  //   description: 'End date for statistics (ISO format)',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Payment statistics retrieved successfully',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       statusCode: { type: 'number', example: 200 },
  //       message: {
  //         type: 'string',
  //         example: 'Payment statistics retrieved successfully',
  //       },
  //       data: {
  //         type: 'object',
  //         properties: {
  //           totalTransactions: { type: 'number' },
  //           completedPayments: { type: 'number' },
  //           failedPayments: { type: 'number' },
  //           pendingPayments: { type: 'number' },
  //           totalAmount: { type: 'number' },
  //         },
  //       },
  //     },
  //   },
  // })
  // // @UseGuards(RolesGuard)
  // // @Roles(Role.ADMIN)
  // async getStats(
  //   @Query('fromDate') fromDate?: string,
  //   @Query('toDate') toDate?: string,
  // ) {
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Payment statistics retrieved successfully',
  //     data: await this.paymentService.getPaymentStats(fromDate, toDate),
  //   };
  // }

  // @Get('order/:orderId')
  // @ApiOperation({
  //   summary: 'Get payments by order ID',
  //   description: 'Retrieve all payment transactions for a specific order',
  // })
  // @ApiParam({ name: 'orderId', type: Number, description: 'Order ID' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Payment transactions for order retrieved successfully',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       statusCode: { type: 'number', example: 200 },
  //       message: {
  //         type: 'string',
  //         example: 'Payment transactions for order retrieved successfully',
  //       },
  //       data: { type: 'array', items: { type: 'object' } },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Order not found',
  // })
  // async findByOrderId(@Param('orderId', ParseIntPipe) orderId: number) {
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Payment transactions for order retrieved successfully',
  //     data: await this.paymentService.findByOrderId(orderId),
  //   };
  // }

  // @Get(':id')
  // @ApiOperation({
  //   summary: 'Get payment transaction by ID',
  //   description: 'Retrieve a specific payment transaction by its ID',
  // })
  // @ApiParam({ name: 'id', type: Number, description: 'Payment transaction ID' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Payment transaction retrieved successfully',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       statusCode: { type: 'number', example: 200 },
  //       message: {
  //         type: 'string',
  //         example: 'Payment transaction retrieved successfully',
  //       },
  //       data: { type: 'object' },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Payment transaction not found',
  // })
  // async findOne(@Param('id', ParseIntPipe) id: number) {
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Payment transaction retrieved successfully',
  //     data: await this.paymentService.findOne(id),
  //   };
  // }

  // @Patch(':id')
  // @ApiOperation({
  //   summary: 'Update payment transaction',
  //   description: 'Update an existing payment transaction',
  // })
  // @ApiParam({ name: 'id', type: Number, description: 'Payment transaction ID' })
  // @ApiBody({ type: UpdatePaymentTransactionDto })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Payment transaction updated successfully',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       statusCode: { type: 'number', example: 200 },
  //       message: {
  //         type: 'string',
  //         example: 'Payment transaction updated successfully',
  //       },
  //       data: { type: 'object' },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Payment transaction not found',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid input data',
  // })
  // // @UseGuards(RolesGuard)
  // // @Roles(Role.ADMIN)
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updatePaymentTransactionDto: UpdatePaymentTransactionDto,
  // ) {
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Payment transaction updated successfully',
  //     data: await this.paymentService.update(id, updatePaymentTransactionDto),
  //   };
  // }

  // @Delete(':id')
  // @ApiOperation({
  //   summary: 'Delete payment transaction',
  //   description: 'Delete a payment transaction by ID',
  // })
  // @ApiParam({ name: 'id', type: Number, description: 'Payment transaction ID' })
  // @ApiResponse({
  //   status: HttpStatus.NO_CONTENT,
  //   description: 'Payment transaction deleted successfully',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       statusCode: { type: 'number', example: 204 },
  //       message: {
  //         type: 'string',
  //         example: 'Payment transaction deleted successfully',
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Payment transaction not found',
  // })
  // // @UseGuards(RolesGuard)
  // // @Roles(Role.ADMIN)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   await this.paymentService.remove(id);
  //   return {
  //     statusCode: HttpStatus.NO_CONTENT,
  //     message: 'Payment transaction deleted successfully',
  //   };
  // }
}
