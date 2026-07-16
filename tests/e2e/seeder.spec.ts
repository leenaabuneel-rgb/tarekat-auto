import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../config/env';
import { RequestsPage } from '../../pages/requests.page';

test.describe('Inheritance seeder', () => {
  test('seeds a random case and logs in as the beneficiary', async ({ seederPage }) => {
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    await seederPage.login();
    await seederPage.generateRandomData();
    const result = await seederPage.seedCase();

    expect(result.inheritanceId).toBeTruthy();
    expect(result.authUserIds.length).toBeGreaterThan(0);

    // New beneficiaries land on the estate-creation onboarding flow instead of /dashboard,
    // so just confirm the impersonated session authenticated onto the web app (not bounced to /login).
    const beneficiaryTab = await seederPage.loginAsBeneficiary(result);
    await expect(beneficiaryTab).not.toHaveURL(/\/login/);
    expect(beneficiaryTab.url()).toContain('.web.azm-dev.com');

    await beneficiaryTab.close();
  });

  test('seeds a case, navigates to الطلبات, and opens case details', async ({ seederPage }) => {
    test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');

    await seederPage.login();
    await seederPage.generateRandomData();
    const result = await seederPage.seedCase();

    const beneficiaryTab = await seederPage.loginAsBeneficiary(result);
    const requestsPage = new RequestsPage(beneficiaryTab);

    await requestsPage.open();
    await expect(beneficiaryTab).toHaveURL(/\/my-orders/);

    await requestsPage.openCaseDetails();
    await expect(beneficiaryTab.getByText('تفاصيل الطلب')).toBeVisible();
    await expect(beneficiaryTab.getByText(result.json.request.requestNumber)).toBeVisible();

    await beneficiaryTab.close();
  });
});
