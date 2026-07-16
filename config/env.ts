import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const env = {
  baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  apiURL: process.env.API_URL ?? 'http://localhost:3000/api',
  ci: !!process.env.CI,
  nafath: {
    username: process.env.NAFATH_USERNAME ?? '',
    password: process.env.NAFATH_PASSWORD ?? '',
  },
  admin: {
    apiURL: process.env.ADMIN_API_URL ?? 'http://localhost:8000',
    username: process.env.ADMIN_USERNAME ?? '',
    password: process.env.ADMIN_PASSWORD ?? '',
  },
};
