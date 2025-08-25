import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from 'src/shared/guards/access1-token.guard';
import { APIKeyGuard } from 'src/shared/guards/api-key.guard';

import { AuthenticationGuard } from 'src/shared/guards/authentication2.guard';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import { HashingService } from './services/hashing.service';
const sharedServices = [PrismaService, HashingService, TokenService];

@Global()
@Module({
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    APIKeyGuard,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
  ],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
