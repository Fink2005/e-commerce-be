import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [SharedModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
