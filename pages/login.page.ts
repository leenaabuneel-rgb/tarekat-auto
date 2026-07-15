import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  async goto() {
    await this.page.goto('/login');
  }

  async loginWithNafath(username: string, password: string) {
    await this.page.getByText('الدخول عن طريق نفاذ').click();
    await this.page.getByLabel('اسم المستخدم').fill(username);
    await this.page.getByLabel('كلمة المرور').fill(password);
    await this.page.getByRole('button', { name: /دخول|تسجيل الدخول/ }).click();
  }
}
