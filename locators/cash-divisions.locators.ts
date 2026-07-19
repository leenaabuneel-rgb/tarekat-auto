import { Page } from '@playwright/test';

export class CashDivisionsLocators {
  constructor(private readonly page: Page) {}

  /** The "الأموال النقدية" card. */
  cashCard() {
    return this.page.getByRole('button', { name: 'الأموال النقدية' });
  }

  startDivisionButton() {
    return this.cashCard().getByRole('button', { name: 'بدء القسمة' });
  }

  agreementCheckbox() {
    return this.page.getByRole('checkbox');
  }

  confirmButton() {
    return this.page.getByRole('button', { name: 'موافق', exact: true });
  }

  closePopupIcon() {
    return this.page.locator('.icon-close-for-popup');
  }

  successDialog() {
    return this.page.getByRole('dialog').filter({ hasText: 'تم تقديم طلب القسمة بنجاح' });
  }

  /** The "حالة الطلب/ القسمة" status for the الأموال النقدية card in the divisions listing. */
  requestStatus() {
    return this.page.getByRole('heading', { name: 'حالة الطلب/ القسمة' }).locator('xpath=..');
  }
}
