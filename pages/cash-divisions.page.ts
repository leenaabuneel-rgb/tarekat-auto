import { BasePage } from './base.page';
import { CashDivisionsLocators } from '../locators/cash-divisions.locators';

export class CashDivisionsPage extends BasePage {
  private readonly locators = new CashDivisionsLocators(this.page);

  /** In the "الأموال النقدية" card, starts the division ("بدء القسمة"). */
  async startCashDivision() {
    await this.locators.startDivisionButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Checks the إقرار وتعهد agreement checkbox and confirms with "موافق". */
  async acceptDivisionAgreement() {
    await this.locators.agreementCheckbox().check();
    await this.locators.confirmButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Dismisses the rating overlay, then waits for and closes the "تم تقديم طلب القسمة بنجاح" success dialog. */
  async closeDivisionSuccessPopup() {
    await this.locators.closePopupIcon().click();

    const dialog = this.locators.successDialog();
    await dialog.waitFor({ state: 'visible' });
    await dialog.getByRole('button', { name: 'Close' }).click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** The "حالة الطلب/ القسمة" status for the الأموال النقدية card in the divisions listing. */
  requestStatus() {
    return this.locators.requestStatus();
  }
}
