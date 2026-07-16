import { BasePage } from './base.page';

export class RequestsPage extends BasePage {
  async open() {
    await this.page.getByText('الطلبات').first().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** The request card whose "نوع الطلب" matches the given type, e.g. 'قسمة التركة'. */
  requestCard(requestType: string) {
    return this.page.locator('div.grid').filter({
      has: this.page.getByText(requestType, { exact: true }),
    });
  }

  /** The "حالة التوزيع" (distribution status) field in the بيانات الطلب tab of the case details view. */
  distributionStatus() {
    return this.page.getByRole('heading', { name: 'حالة التوزيع' }).locator('xpath=..');
  }

  /** Opens the case-level details view (the "مشاهدة التفاصيل" button beside اسم الموّرث). */
  async openCaseDetails() {
    await this.page.getByRole('button', { name: 'مشاهدة التفاصيل' }).first().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

    async openDivisionsListingPage() {
    const tabsContainer = this.page.locator(
      '//*[@id="app"]/div/div/div[3]/div/div[2]/div/div[1]/div[3]/div',
    );
    await tabsContainer.getByText('قسمة التركة').click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}
