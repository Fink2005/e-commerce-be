import {
    Body,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    Post,
    Query
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    LoginDTO,
    LoginResDTO,
    LogoutDTO,
    LogoutResDTO,
    RefreshDTO,
    RefreshResDTO,
    RegisterDTO,
    RegisterResDTO,
    SendEmailDTO,
    VerifyEmailDTO
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

  @Post('send-email')
  @ApiOperation({ summary: 'Send confirmation email' })
  @ApiResponse({ status: 201, description: 'Email sent successfully', type: SendEmailDTO })
    async sendEmail(@Body() body: SendEmailDTO) {
        return await this.authService.sendEmail(body.email);
    }

    @Get('verify-email')
    @ApiOperation({ summary: 'Verify email with token' })
    @ApiQuery({
      name: 'code',
      required: true,
      description: 'Email verification token',
      example: 'your-verification-token-here',
    })
    @ApiResponse({ status: 200, description: 'Email verified successfully' })
    async verifyEmail(@Query() query: VerifyEmailDTO) {
      return await this.authService.verifyEmail(query.code);
    }
    


  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, type: LogoutResDTO })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async logout(@Body() body: LogoutDTO) {
    return await this.authService.logout(body.refreshToken);
  }
}