import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { userDTO } from 'src/routes/user/user.dto';
import { UserService } from 'src/routes/user/user.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { TokenPayload } from 'src/shared/types/jwt.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'Get all users data' })
  @ApiResponse({
    status: 200,
    description: 'Get all users info',
    type: userDTO,
  })
  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get your info data' })
  @ApiResponse({
    status: 200,
    description: 'Get user info data successfully',
    type: userDTO,
  })
  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@ActiveUser() user: TokenPayload): Promise<userDTO | null> {
    return await this.userService.getMe(user);
  }
}
