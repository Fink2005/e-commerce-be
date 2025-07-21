import {
    Body,
    ConflictException,
    Controller,
    HttpCode,
    Post
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    LoginDTO,
    LoginResDTO,
    LogoutDTO,
    LogoutResDTO,
    RefreshDTO,
    RefreshResDTO,
    RegisterDTO,
    RegisterResDTO
} from 'src/routes/auth/auth.dto';
import { AuthService } from 'src/routes/auth/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, type: RegisterResDTO })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() body: RegisterDTO) {
    const user = await this.authService.register(body);
    if (!user) {
      throw new ConflictException('Registration failed');
    }
    return user;
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: LoginResDTO })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: LoginDTO) {
    const user = await this.authService.login(body);
    return user;
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, type: RefreshResDTO })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() body: RefreshDTO) {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, type: LogoutResDTO })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async logout(@Body() body: LogoutDTO) {
    return await this.authService.logout(body.refreshToken);
  }
}