import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from 'src/routes/auth/auth.module';
import { ProductsModule } from 'src/routes/products/products.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService,
    {
        provide: APP_PIPE,
        useClass: ZodValidationPipe,
      },
  ],
})
export class AppModule {}
