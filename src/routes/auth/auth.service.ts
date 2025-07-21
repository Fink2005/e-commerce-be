import {
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import console from 'console';
import type { LoginDTO, RegisterDTO } from 'src/routes/auth/auth.dto';
import {
    isNotFoundPrismaError
} from 'src/shared/helpers';
import { EmailService } from 'src/shared/services/email.service';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService
  ) {}
  async register(body: RegisterDTO) {
    const hashedPassword = await this.hashingService.hash(body.password);
   const isUserExist= await this.prismaService.user.findUnique({
       where: { email: body.email },
     });
     console.log(isUserExist);

     if (isUserExist) {
         throw new UnprocessableEntityException([
            {
              field: 'email',
              message: 'Email already exists',
            },
         ]);
     }

    await this.prismaService.user.create({
       data: {
           email: body.email,
           name: body.name,    
           password: hashedPassword,
           role: 'CUSTOMER',
           emailConfirmToken: uuidv4(),
           emailConfirmTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000)
       },
     });
    
    return {success: true};    
  }
  async login(body: LoginDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashingService.compare(
      body.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException(
        'Email not verified, please check your email',
      );
    }

    return {
        tokens: await this.generateTokens({ userId: user.id }),
        user: {
          role: user.role,
          isEmailConfirmed: user.isEmailConfirmed,
        },
    };
  } 

  async logout(refreshToken: string) {
    try {
      // 1 verify refresh token
      await this.tokenService.verifyRefreshToken(refreshToken);
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });
      return { message: 'Logout successfully' };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token not found');
      }
      throw new UnauthorizedException();
    }
  }
  async refreshToken(refreshToken: string) {
    try {
      // 1 verify refresh token
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);
      const storedToken = await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });

      if (new Date() > storedToken.expiresAt) {
        await this.prismaService.refreshToken.delete({
          where: { token: refreshToken },
        });
        throw new UnauthorizedException('Refresh token expired');
      }

      await this.prismaService.refreshToken.delete({
        where: { 
          token: refreshToken,
        },
      });
      return this.generateTokens({ userId });
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }
      throw new UnauthorizedException();
    }
  }

  async sendEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
  // Check if user exists
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
  
    const { isEmailConfirmed, emailConfirmToken } = user;
  
    if (isEmailConfirmed) {
      throw new UnauthorizedException(
        'Email has already been confirmed, please login to continue',
      );
    }
  
    if (!emailConfirmToken) {
      throw new UnauthorizedException('Email confirmation token not found');
    }

    const { error } = await this.emailService.sendEmail(email, user.name!, emailConfirmToken, 'verify');
  
    if (error) {
      throw new UnprocessableEntityException('Failed to send email');
    }
    return { to: email, success: true, message: 'Email sent successfully' };
  }

  async verifyEmail(emailConfirmToken: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        emailConfirmToken,
      },
    });
    

    if (!user) {
      throw new UnauthorizedException('Invalid or expired email verified token');
    }

    if (user.emailConfirmTokenExpiresAt
        && user.emailConfirmTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Email verification token has expired, please request a new one');
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        isEmailConfirmed: true,
        emailConfirmToken: null,
        emailConfirmTokenExpiresAt: null,
      },
    });

    return { success: true, message: 'Email verified successfully' };
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);
    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
