import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { ApiInterceptor } from '../../utils/ApiInterceptor.js';
import { credentials } from '../../testdata/credentials.js';
test('NEGATIVE - Login with Invalid Password', async ({ page }) => {

  const login = new LoginPage(page);
  await login.navigate();

  await login.login(credentials.email, 'WrongPassword123');

  const errorMsg = page.locator('text=/invalid|incorrect|not found/i');
  await errorMsg.first().waitFor({ timeout: 60000 });

  expect(page.url()).not.toContain('/dashboard');
});