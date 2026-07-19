import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { RequestsPage } from '../../pages/requests.page';
import { CashDivisionsPage } from '../../pages/cash-divisions.page';
import { TawtheeqClient } from '../../api/clients/tawtheeq.client';

test.describe('Inheritance seeder', () => {

  test('seeds a case, navigates to الطلبات, and opens case details', async ({ seederPage, request }) => {
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    await seederPage.login();
    await seederPage.generateRandomData();
    const result = await seederPage.seedCase();

    const tawtheeqClient = new TawtheeqClient(request, env.tawtheeq.baseURL);
    const tawtheeqResponse = await tawtheeqClient.seedCase(result.json);
    expect(tawtheeqResponse.ok()).toBeTruthy();

    const beneficiaryTab = await seederPage.loginAsBeneficiary(result);
    const requestsPage = new RequestsPage(beneficiaryTab);

    await requestsPage.open();
    await expect(beneficiaryTab).toHaveURL(/\/my-orders/);

    await expect(requestsPage.requestCard('قسمة التركة')).toContainText('لم تبدأ بعد');

    await requestsPage.openCaseDetails();
    await expect(beneficiaryTab.getByText('تفاصيل الطلب')).toBeVisible();
    await expect(beneficiaryTab.getByText(result.json.request.requestNumber)).toBeVisible();

    await requestsPage.openDivisionsListingPage();

    const cashDivisionsPage = new CashDivisionsPage(beneficiaryTab);
    await cashDivisionsPage.startCashDivision();
    await cashDivisionsPage.acceptDivisionAgreement();
    await cashDivisionsPage.closeDivisionSuccessPopup();

    await requestsPage.open();
    await expect(beneficiaryTab).toHaveURL(/\/my-orders/);
    await expect(requestsPage.requestCard('قسمة التركة')).toContainText('قيد التنفيذ');

    await requestsPage.openCaseDetails();
    await expect(requestsPage.distributionStatus()).toContainText('لم تبدأ بعد');

    await requestsPage.openDivisionsListingPage();
    await expect(cashDivisionsPage.requestStatus()).toContainText('بانتظار موافقة الورثة');

    //await beneficiaryTab.close();
  });
});
