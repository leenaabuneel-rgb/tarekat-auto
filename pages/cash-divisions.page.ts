import { BasePage } from './base.page';

export class CashDivisionsPage extends BasePage {
  /** In the "الأموال النقدية" card, starts the division ("بدء القسمة"). */
  async startCashDivision() {
    const cashCard = this.page.getByRole('button', { name: 'الأموال النقدية' });
    await cashCard.getByRole('button', { name: 'بدء القسمة' }).click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Checks the إقرار وتعهد agreement checkbox and confirms with "موافق". */
  async acceptDivisionAgreement() {
    await this.page.getByRole('checkbox').check();
    await this.page.getByRole('button', { name: 'موافق', exact: true }).click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Dismisses the rating overlay, then waits for and closes the "تم تقديم طلب القسمة بنجاح" success dialog. */
  async closeDivisionSuccessPopup() {
    await this.page.locator('.icon-close-for-popup').click();

    const dialog = this.page.getByRole('dialog').filter({ hasText: 'تم تقديم طلب القسمة بنجاح' });
    await dialog.waitFor({ state: 'visible' });
    await dialog.getByRole('button', { name: 'Close' }).click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** The "حالة الطلب/ القسمة" status for the الأموال النقدية card in the divisions listing. */
  requestStatus() {
    return this.page.getByRole('heading', { name: 'حالة الطلب/ القسمة' }).locator('xpath=..');
  }
}
