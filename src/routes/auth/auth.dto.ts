import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// =======================
// 🧩 Zod Schemas
// =======================

const LoginSchema = z.object({
  email: z.string().email().nonempty({ message: 'Email is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

const RegisterSchema = LoginSchema.extend({
  name: z.string().nonempty({ message: 'Name is required' }),
});

const RefreshSchema = z.object({
  refreshToken: z.string().nonempty({ message: 'Refresh token is required' }),
});

const MessageSchema = z.object({
  message: z.string(),
});

const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const RegisterResSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});


const SendEmailSchema = z.object({
    email: z.string().email().nonempty({ message: 'Email is required' }),
})


const ForgotPasswordSchema = z.object({
    email: z.string().email().nonempty({ message: 'Email is required' }),
})

const VerifyPasswordSchema = z.object({
    code: z.string().nonempty({ message: 'Verification code is required' }),
});

const NewPasswordSchema =  VerifyPasswordSchema.extend({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
})

// =======================
// 📥 Input DTOs
// =======================

export class LoginDTO extends createZodDto(LoginSchema) {
  @ApiProperty({ example: 'user@example.com' }) email: string;
  @ApiProperty({ example: 'SecurePassword123!' }) password: string;
}

export class RegisterDTO extends createZodDto(RegisterSchema) {
  @ApiProperty({ example: 'user@example.com' }) email: string;
  @ApiProperty({ example: 'SecurePassword123!' }) password: string;
  @ApiProperty({ example: 'John Doe' }) name: string;
}

export class RefreshDTO extends createZodDto(RefreshSchema) {
  @ApiProperty({ example: 'your-refresh-token-here' }) refreshToken: string;
}



export class SendEmailDTO extends createZodDto(SendEmailSchema) {
    @ApiProperty({ example: 'your-email-here' })  email: string;
}

export class VerifyEmailDTO {
  @ApiProperty({ example: 'your-verification-token-here' })
  code: string;
}


export class ForgotPasswordDTO extends createZodDto(ForgotPasswordSchema) {
    @ApiProperty({example: 'your-email-here'}) email: string;
}
export class VerifyPasswordDTO extends createZodDto(VerifyPasswordSchema) {
    @ApiProperty({ example: 'your-verification-code-here' }) code: string;
}

export class NewPasswordDTO extends createZodDto(NewPasswordSchema) {
    @ApiProperty({ example: 'NewSecurePassword123!' }) password: string;
    @ApiProperty({ example: 'your-verification-code-here' }) code: string;
}


// =======================
// 📤 Output DTOs
// =======================

export class LoginResDTO extends createZodDto(TokenResponseSchema) {
  @ApiProperty({ example: 'access-token' }) accessToken: string;
  @ApiProperty({ example: 'refresh-token' }) refreshToken: string;
}

export class RefreshResDTO extends LoginResDTO {}



export class RegisterResDTO extends createZodDto(RegisterResSchema) {
  @ApiProperty({ example: 123 }) id: number;
  @ApiProperty({ example: 'user@example.com' }) email: string;
  @ApiProperty({ example: 'John Doe' }) name: string;
  @ApiProperty({ example: '2024-07-21T10:30:00.000Z' }) created_at: Date;
  @ApiProperty({ example: '2024-07-21T10:30:00.000Z' }) updated_at: Date;
}
