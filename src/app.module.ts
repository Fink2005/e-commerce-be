import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from 'src/routes/auth/auth.module';
import { PaymentModule } from 'src/routes/payment/payment.module';
import { ProductsModule } from 'src/routes/products/products.module';
import { UserModule } from 'src/routes/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, ProductsModule, UserModule, PaymentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
