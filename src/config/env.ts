import { config } from 'dotenv';

// Load environment variables from the appropriate file
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Destructure with default values and assert the type
export const {
  PORT = '5500', // Default port if not provided
  NODE_ENV = 'development',
  MONGO_URI = '',
  JWT_SECRET="",
   JWT_EXPIRES_IN="",
   ORIGIN=""
} = process.env as { PORT: string; NODE_ENV: string; MONGO_URI: string , JWT_SECRET:string, JWT_EXPIRES_IN:string,ORIGIN:string };
