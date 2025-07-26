import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['CUSTOMER', 'ADMIN']).default('CUSTOMER'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class userDTO extends createZodDto(userSchema) {
  id: number;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}
