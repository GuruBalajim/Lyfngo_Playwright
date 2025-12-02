import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { ApiInterceptor } from '../../utils/ApiInterceptor.js';
import { credentials } from '../../testdata/credentials.js';

test('Lyfngo Login + API Validation', async ({ page }) => {

  const interceptor = new ApiInterceptor(page);
 

  // ✅ START CAPTURE BEFORE NAVIGATION
  interceptor.startCapture();

  const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);

  await Promise.race([
    page.waitForURL('**/dashboard', { timeout: 30000 }),
    page.waitForSelector('text=Dashboard', { timeout: 30000 })
  ]);

  interceptor.stopCapture();

  await interceptor.saveFiles("login");

  // ✅ THIS WILL NOW PASS
  expect(interceptor.logs.length).toBeGreaterThan(0);
});
