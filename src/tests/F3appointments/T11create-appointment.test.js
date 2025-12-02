import { test, expect } from "@playwright/test";
import { AppointmentPage } from "../../pages/AppointmentPage.js";
import { appointmentData } from "../../testdata/appointment-test-data.js";
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";
test("Add Appointment", async ({ page }, testInfo) => {
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
  const appointment = new AppointmentPage(page);

  await appointment.openPatient(appointmentData.patientName);
  await appointment.openAppointmentTab();
  api.startCapture();
  await appointment.openAddAppointmentForm();

  await appointment.selectDate(appointmentData.dateText);
  await appointment.selectTime(appointmentData.time);
  await appointment.selectDoctor(appointmentData.doctorName);

  await appointment.saveAppointment();
  api.stopCapture();
  await api.saveFiles("Add-appointment-by-Patient");
  await page.waitForLoadState("networkidle");

  await appointment.verifyAppointment(
    appointmentData.verifyDate,
    appointmentData.verifyTime
  );
});
