import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { CashDivisionsPage } from '../../pages/cash-divisions.page';
import { DataPreparation } from '../../steps/data-preparation';
import { DivisionsList } from '../../steps/divisions-list';

test.describe('Inheritance seeder', () => {

  test('seeds a case, navigates to الطلبات, and opens case details @smoke', async ({ seederPage, request }) => {
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    const dataPreparation = new DataPreparation(seederPage, request);
    const { result, beneficiaryTab } = await test.step(
      'Pre-requisite: seed case data, mock Tawtheeq, and log in as beneficiary',
      () => dataPreparation.seedCase(),
    );

    const divisionsList = new DivisionsList(beneficiaryTab, result);
    const requestsPage = await test.step('openDivisionsList', () =>
      divisionsList.run(),
    );

    const cashDivisionsPage = new CashDivisionsPage(beneficiaryTab);
    await cashDivisionsPage.showAssets();
    await cashDivisionsPage.acceptDivisionAgreement();
    await cashDivisionsPage.startDivision();
    await cashDivisionsPage.closeDivisionSuccessPopup();

    await requestsPage.open();
    await expect(beneficiaryTab).toHaveURL(/\/my-orders/);
    await expect(requestsPage.requestCard('قسمة التركة')).toContainText('قيد التنفيذ');

    await requestsPage.openCaseDetails();
    await expect(requestsPage.distributionStatus()).toContainText('بانتظار بدء القسمة');

    await requestsPage.openDivisionsListingPage();
    await expect(cashDivisionsPage.requestStatus()).toContainText('بانتظار موافقة الورثة');

    //await beneficiaryTab.close();
  });
});
