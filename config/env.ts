export const env = {
  baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  apiURL: process.env.API_URL ?? 'http://localhost:3000/api',
  ci: !!process.env.CI,
  nafath: {
    username: process.env.NAFATH_USERNAME ?? '',
    password: process.env.NAFATH_PASSWORD ?? '',
  },
};
