import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { AddAppointmentFromNavPage } from '../../pages/AddAppointmentFromNavPage.js';
import { navAddAppointmentData } from '../../testdata/nav_addappointmnet.js';
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";
test('Add Appointment from nav bar', async ({ page },testInfo) => {
    const api = new ApiInterceptor(page, testInfo);
  
      const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);
  await page.waitForTimeout(2000);

  // ================= SELECT ESTABLISHMENT =================
  const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
  await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
  await page.waitForTimeout(1000);
  await establishmentDropdown.click();
  await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

    const appointment = new AddAppointmentFromNavPage(page);
      
api.startCapture();
    await appointment.addAppointmentFlow(
        navAddAppointmentData.patientSearchKey,
        navAddAppointmentData.dateLabel,
        navAddAppointmentData.doctorName
    );
  api.stopCapture();
  await api.saveFiles("add-nav-appointment-api");
    await expect(page.getByText(navAddAppointmentData.expectedMessage)).toBeVisible();
});
