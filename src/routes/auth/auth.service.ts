import {
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import type { LoginDTO, RegisterDTO } from 'src/routes/auth/auth.dto';
import {
    isNotFoundPrismaError,
} from 'src/shared/helpers';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService
  ) {}
  async register(body: RegisterDTO) {
    const hashedPassword = await this.hashingService.hash(body.password);
    const user = await this.prismaService.user.create({
      data: {
          email: body.email,
          name: body.name,    
          password: hashedPassword,
          role: 'CUSTOMER',
      },
    });
    return user;    
  }
  async login(body: LoginDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }   
    const isPasswordValid = await this.hashingService.compare(
      body.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnprocessableEntityException([      
        {
          field: 'password',
          message: 'Password is incorrect',
        },
      ]);
    }   
    const tokens = await this.generateTokens({ userId: user.id });
    return tokens;
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
