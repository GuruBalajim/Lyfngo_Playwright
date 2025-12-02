import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { PatientPage } from '../../pages/PatientPage.js';
import { credentials } from '../../testdata/credentials.js';
import { ApiInterceptor } from '../../utils/ApiInterceptor.js';

import fs from "fs";
test('N3 - Add Patient: Mobile number empty', async ({ page },testInfo) => {
         const api = new ApiInterceptor(page, testInfo);

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
api.startCapture();
  // OPEN ADD PATIENT FORM
  const patientPage = new PatientPage(page);
  await patientPage.openAddPatientForm();

  // ✅ Fill ONLY patient name, leave phone empty
  await patientPage.fillBasicDetails('Hari', '');

  // Click Save
  await patientPage.save();

  // ✅ VERIFY VALIDATION MESSAGE
  await expect(
    page.getByText('Please enter the mobile number')
  ).toBeVisible();
api.stopCapture();
  await api.saveFiles("N2-name-empty");
  console.log('✅ N3 Passed: Mobile number required validation displayed');
});
