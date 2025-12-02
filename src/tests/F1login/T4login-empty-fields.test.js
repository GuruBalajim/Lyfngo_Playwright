import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';

test('NEGATIVE - Login with Empty Email', async ({ page }) => {

  const login = new LoginPage(page);
  await login.navigate();

  const submitBtn = page.getByRole('button', { name: 'Submit' });
  await submitBtn.waitFor({ timeout: 60000 });
  await submitBtn.click();

  const errorMsg = page.locator('text=Please enter your Email');
  await expect(errorMsg).toBeVisible({ timeout: 60000 });

  expect(page.url()).not.toContain('/dashboard');
});
