import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { PatientPage } from '../../pages/PatientPage.js';
import { credentials } from '../../testdata/credentials.js';

test('N1 - Add Patient: Click Save with all fields empty', async ({ page }) => {

  // Login
  const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);
   await page.waitForTimeout(1000); 

  // Select Establishment
// Select Establishment with extended wait
 const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' }); 
  await establishmentDropdown.waitFor({ state: 'visible', timeout: 250000 });
   await page.waitForTimeout(1000); // allow animations to settle 
   await establishmentDropdown.click(); 
   await page.getByRole('option', { name: 'Hosptial_multicare' }).click();
  // Open Add Patient form
  const patientPage = new PatientPage(page);
  await patientPage.openAddPatientForm();

  // ✅ Do NOT fill any fields
  await patientPage.save();

  // ===============================
  // ✅ VERIFY ERROR MESSAGES
  // ===============================

 await expect(page.getByText('Please enter the patient name')).toBeVisible();
  await expect(page.getByText('Please enter the mobile number')).toBeVisible();
  await expect(page.getByText('Pincode is required *')).toBeVisible();

  console.log("✅ Negative Test Passed: Validation errors displayed for empty fields");
});
