
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { SeederPage } from '../pages/seeder.page';

type Fixtures = {
  loginPage: LoginPage;
  seederPage: SeederPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  seederPage: async ({ page }, use) => {
    await use(new SeederPage(page));
  },
});

export { expect } from '@playwright/test';
