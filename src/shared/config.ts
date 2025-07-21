import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// Load .env
const envPath = path.resolve('.env');
if (!fs.existsSync(envPath)) {
  console.log('Không tìm thấy file .env');
  process.exit(1);
}
dotenv.config({ path: envPath });

// Define Zod schema
const ConfigSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  ACCESS_TOKEN_SECRET: z.string().nonempty(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().nonempty(),
  SECRET_API_KEY: z.string().nonempty(),
  REFRESH_TOKEN_SECRET: z.string().nonempty(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().nonempty(),
});

// Validate process.env
const result = ConfigSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:\n');
  console.error(result.error.format());
  process.exit(1);
}

// Export the parsed and validated config
const envConfig = result.data;

export default envConfig;
