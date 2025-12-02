import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { PatientPage } from '../../pages/PatientPage.js';
import { credentials } from '../../testdata/credentials.js';
test('N5 - Add Patient: Invalid Email Format', async ({ page }) => {

  // LOGIN
  const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);
   await page.waitForTimeout(1000); 

  // SELECT ESTABLISHMENT
// Select Establishment with extended wait
 const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' }); 
  await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
   await page.waitForTimeout(1000); // allow animations to settle 
   await establishmentDropdown.click(); 
   await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

  // OPEN ADD PATIENT FORM
  const patientPage = new PatientPage(page);
  await patientPage.openAddPatientForm();
  await patientPage.expandMoreDetails();

  // ✅ Fill mandatory + invalid email
  await patientPage.fillBasicDetails('Hari', '7711551584');
  await page.getByRole('textbox', { name: 'Email' }).fill('hari@'); // Invalid email

  // Click Save
  await patientPage.save();

  // ✅ VERIFY INVALID EMAIL MESSAGE
  await expect(
     page.getByText('You must enter a valid email')
  ).toBeVisible();

  console.log('✅ N6 Passed: Invalid email format validation displayed');
});
