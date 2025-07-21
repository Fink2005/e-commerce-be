import {
    Body,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    Post,
    Query,
    Req,
    Res
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
    LoginDTO,
    LoginResDTO,
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
  async login(@Body() body: LoginDTO, @Res({ passthrough: true }) res: Response) {
    const {tokens, user} = await this.authService.login(body);
    res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

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
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async logout( @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'];
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      res.clearCookie('refresh_token',  {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    return await this.authService.logout(refreshToken);
  }
}