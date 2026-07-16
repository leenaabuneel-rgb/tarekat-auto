import { BasePage } from './base.page';

export class RequestsPage extends BasePage {
  async open() {
    await this.page.getByText('الطلبات').first().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Opens the case-level details view (the "مشاهدة التفاصيل" button beside اسم الموّرث). */
  async openCaseDetails() {
    await this.page.getByRole('button', { name: 'مشاهدة التفاصيل' }).first().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

    async openDivisionsListingPage() {
    await this.page.getByRole('button', { name: 'قسمة التركة' }).first().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}
