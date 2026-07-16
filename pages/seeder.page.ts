import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { env } from '../config/env';

export type SeedCaseJson = {
  _name: string;
  deceased: Record<string, unknown>;
  beneficiary: { identityNumber: string; fullName: string; [key: string]: unknown };
  heirs: Array<Record<string, unknown>>;
  request: { id: number; requestNumber: string };
  estateAssets: Record<string, unknown>;
};

export type SeedResult = {
  inheritanceId: string;
  heirsCount: number;
  authUserIds: number[];
  json: SeedCaseJson;
};

export class SeederPage extends BasePage {
  async login(username: string = env.admin.username, password: string = env.admin.password) {
    await this.page.goto(`${env.admin.apiURL}/admin/inheritance_seeder/inheritanceseeder/seed/`);
    await this.page.getByLabel('Username:').fill(username);
    await this.page.getByLabel('Password:').fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async generateRandomData() {
    await this.page.getByRole('button', { name: 'Generate Random Data' }).click();
    // The fill is async client-side JS; give it time to populate before submitting.
    await this.page.waitForTimeout(1500);
  }

  async seedCase(): Promise<SeedResult> {
    await this.page.locator('input[type=submit][value="Seed Case"]').click();
    await this.page.waitForLoadState('networkidle').catch(() => {});

    const bodyText = await this.page.locator('body').innerText();
    const successLine = bodyText.split('\n').find((line) => line.includes('seeded successfully'));
    if (!successLine) {
      throw new Error('Seed Case did not report success');
    }

    const inheritanceId = successLine.match(/Inheritance ID: ([\w-]+)/)?.[1] ?? '';
    const heirsCount = Number(successLine.match(/Heirs: (\d+)/)?.[1] ?? 0);
    const authUserIds = (successLine.match(/Auth User IDs: \[([^\]]*)\]/)?.[1] ?? '')
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !Number.isNaN(id));

    const json = await this.page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('pre, code'));
      for (const block of blocks) {
        const content = block.textContent?.trim() ?? '';
        if (content.startsWith('{') && content.includes('"beneficiary"')) return content;
      }
      return null;
    });
    if (!json) {
      throw new Error('Could not extract seed case JSON from the page');
    }

    return { inheritanceId, heirsCount, authUserIds, json: JSON.parse(json) };
  }

  async loginAsBeneficiary(result: SeedResult): Promise<Page> {
    const row = this.page.locator('tr', { hasText: result.json.beneficiary.identityNumber });
    const loginLink = row.first().locator('a, button').filter({ hasText: /Login as User/i });

    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page'),
      loginLink.first().click(),
    ]);
    await popup.waitForLoadState('networkidle').catch(() => {});
    return popup;
  }
}
