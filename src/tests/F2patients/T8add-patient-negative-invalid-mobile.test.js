import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { PatientPage } from '../../pages/PatientPage.js';
import { credentials } from '../../testdata/credentials.js';

test('N4 - Add Patient: Invalid Mobile Number Format', async ({ page }) => {

  // LOGIN
  const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);
   await page.waitForTimeout(1000); 

  // SELECT ESTABLISHMENT
  // Select Establishment with extended wait
 const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' }); 
  await establishmentDropdown.waitFor({ state: 'visible', timeout: 250000 });
   await page.waitForTimeout(1000); // allow animations to settle 
   await establishmentDropdown.click(); 
   await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

  // OPEN ADD PATIENT FORM
  const patientPage = new PatientPage(page);
  await patientPage.openAddPatientForm();

  // ✅ Enter valid name but INVALID phone number
  await patientPage.fillBasicDetails('Hari', '12345'); // Invalid format

  // Click Save
  await patientPage.save();

  // ✅ VERIFY INVALID MOBILE MESSAGE
  await expect(
    page.getByText('Mobile number should be')
  ).toBeVisible();

  console.log('✅ N4 Passed: Invalid mobile number validation displayed');
});
