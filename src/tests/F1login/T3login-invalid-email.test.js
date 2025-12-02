import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';

test.setTimeout(120000);

test('NEGATIVE - Login with Unregistered Email', async ({ page }) => {

  const login = new LoginPage(page);
  await login.navigate();

  await login.login('notregistered@email.com', 'SomePassword123');

  // ✅ Correct UI validation
  const errorMsg = page.locator('text=Email address not yet registered');
  await expect(errorMsg).toBeVisible({ timeout: 60000 });

  expect(page.url()).not.toContain('/dashboard');
});

