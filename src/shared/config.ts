import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const envPath = path.resolve('.env');

// Only load .env if it exists (for local dev)
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('.env file not found — assuming environment variables are set externally (e.g. on Render)');
}

// Zod schema
const ConfigSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  ACCESS_TOKEN_SECRET: z.string().nonempty(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().nonempty(),
  SECRET_API_KEY: z.string().nonempty(),
  REFRESH_TOKEN_SECRET: z.string().nonempty(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().nonempty(),
  RESEND_API_KEY: z.string().nonempty(),
});

// Validate
const result = ConfigSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:\n');
  console.error(result.error.format());
  process.exit(1);
}

const envConfig = result.data;
export default envConfig;
