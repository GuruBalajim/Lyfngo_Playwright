import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { PatientPage } from '../../pages/PatientPage.js';
import { ApiInterceptor } from '../../utils/ApiInterceptor.js';
import { credentials } from '../../testdata/credentials.js';
import { patientData } from '../../testdata/patientData.js';
import fs from "fs";

test('Add Patient → Verify → Save to TXT', async ({ page }, testInfo) => {

  test.setTimeout(120000);

  const api = new ApiInterceptor(page, testInfo);


  // ================= LOGIN =================
  const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);
  await page.waitForTimeout(1000);

  // ================= SELECT ESTABLISHMENT =================
  const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
  await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
  await page.waitForTimeout(1000);
  await establishmentDropdown.click();
  await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

  // ================= ADD PATIENT =================
  const patientPage = new PatientPage(page);
   api.startCapture(); 
  // ✅ START API CAPTURE
  await patientPage.openAddPatientForm();

  await patientPage.fillBasicDetails(patientData.name, patientData.phone);
  await patientPage.expandMoreDetails();
  await patientPage.fillAdditionalDetails(patientData);
  await patientPage.selectState(patientData.state);
  await patientPage.fillPostalCode(patientData.postalCode);
  await patientPage.save();

  // Wait for backend to complete
  await page.waitForLoadState('networkidle');

  // ⛔ DO NOT LOG HERE AGAIN


  // ================= STOP API CAPTURE =================
  const apiLogs = api.stopCapture();
  await api.saveFiles();
  // ================= WAIT FOR PATIENT PROFILE =================
  await page.waitForSelector(`text=${patientData.name}`, { timeout: 60000 });
  const nameVisible = await page.locator(`text=${patientData.name}`).isVisible();
  expect(nameVisible).toBeTruthy();

  // ================= GET DISPLAYED VALUES =================
  const displayedName = await page.locator(`text=${patientData.name}`).first().textContent();

  let displayedPhone = 'Not Found';
  try { displayedPhone = await page.getByText(patientData.phone).textContent(); } catch {}

  let displayedEmail = 'Not Found';
  try { displayedEmail = await page.getByText(patientData.email).textContent(); } catch {}

  let displayedAddress = 'Not Found';
  try { displayedAddress = await page.getByText(patientData.address).textContent(); } catch {}

  let displayedPostalCode = 'Not Found';
  try { displayedPostalCode = await page.getByText(patientData.postalCode).textContent(); } catch {}

  let displayedState = 'Not Found';
  try { displayedState = await page.getByText(patientData.state).textContent(); } catch {}

  const results = {
    name: displayedName?.includes(patientData.name),
    phone: displayedPhone?.includes(patientData.phone),
    email: displayedEmail?.includes(patientData.email),
    address: displayedAddress?.includes(patientData.address),
    postalCode: displayedPostalCode?.includes(patientData.postalCode),
    state: displayedState?.includes(patientData.state)
  };

  // ================= TXT REPORT =================
  const report = `
PATIENT DATA VERIFICATION REPORT
================================

Expected Name     : ${patientData.name}
Displayed Name    : ${displayedName}

Expected Phone    : ${patientData.phone}
Displayed Phone   : ${displayedPhone}

Expected Email    : ${patientData.email}
Displayed Email   : ${displayedEmail}

Expected Address  : ${patientData.address}
Displayed Address : ${displayedAddress}

Expected Pincode  : ${patientData.postalCode}
Displayed Pincode : ${displayedPostalCode}

Expected State    : ${patientData.state}
Displayed State   : ${displayedState}

---------------------------------
VERIFICATION STATUS
---------------------------------
Name       : ${results.name ? 'PASS ✅' : 'FAIL ❌'}
Phone      : ${results.phone ? 'PASS ✅' : 'FAIL ❌'}
Email      : ${results.email ? 'PASS ✅' : 'FAIL ❌'}
Address    : ${results.address ? 'PASS ✅' : 'FAIL ❌'}
Pincode    : ${results.postalCode ? 'PASS ✅' : 'FAIL ❌'}
State      : ${results.state ? 'PASS ✅' : 'FAIL ❌'}

OVERALL RESULT :
${Object.values(results).every(r => r) ? '✅ SUCCESS' : '❌ FAILED'}
`;

  fs.writeFileSync("patient_result.txt", report);

  // ================= SAVE API LOG (ONLY ONCE) =================
  await api.saveFiles("add-patient-api");

  console.log("✅ Patient verification completed successfully");
});
