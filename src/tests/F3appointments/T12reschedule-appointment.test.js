import { test } from "@playwright/test";
import { RescheduleAppointmentPage } from "../../pages/RescheduleAppointmentPage.js";
import { LoginPage } from "../../pages/LoginPage.js";
import { rescheduleAppointmentData } from "../../testdata/reschedule-appointment-test-data.js";
import { credentials } from "../../testdata/credentials.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";

test("Reschedule Appointment", async ({ page }, testInfo) => {
  const api = new ApiInterceptor(page, testInfo);


  // LOGIN
  const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);
    // ================= SELECT ESTABLISHMENT =================
  const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
  await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
  await page.waitForTimeout(1000);
  await establishmentDropdown.click();
  await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

  const reschedule = new RescheduleAppointmentPage(page);

  // FLOW
  await reschedule.openPatient(rescheduleAppointmentData.patientName);
  await reschedule.openAppointmentTab();
    api.startCapture();
  await reschedule.openAppointmentMenu();
  await reschedule.chooseRescheduleOption();
  await reschedule.selectNewDate(rescheduleAppointmentData.newDate);
  await reschedule.selectNewTime(rescheduleAppointmentData.newTime);
  await reschedule.confirmReschedule();

  // VERIFY
  await reschedule.verifyRescheduled(
  rescheduleAppointmentData.verifyDate,
  rescheduleAppointmentData.verifyTime
);


  // API LOG
  api.stopCapture();
  await api.saveFiles("reschedule-appointment-api");
});
