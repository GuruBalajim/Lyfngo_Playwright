import { test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage.js";
import { CancelAppointmentPage } from "../../pages/CancelAppointmentPage.js";
import { credentials } from "../../testdata/credentials.js";
import { cancelAppointmentData } from "../../testdata/cancel-appointment-data.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";

test("Cancel Appointment", async ({ page }, testInfo) => {
  const api = new ApiInterceptor(page, testInfo);
  

  // LOGIN
  const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);

  // SELECT ESTABLISHMENT
  const establishmentDropdown = page.getByRole("combobox", { name: /establishment name/i });
  await establishmentDropdown.waitFor({ state: "visible", timeout: 25000 });

  await establishmentDropdown.click();
  await page.getByRole("option", { name: /Hosptial_multicare/i }).click();

  // PAGE
  const cancelPage = new CancelAppointmentPage(page);

  api.startCapture();

  // FLOW
  await cancelPage.openPatient(cancelAppointmentData.patientName);
  await cancelPage.openAppointmentTab();
  await cancelPage.openAppointmentCard();
  await cancelPage.clickAppointmentMenu();
  await cancelPage.selectCancelOption();
  await cancelPage.selectReason(cancelAppointmentData.cancelReason);
  await cancelPage.confirmCancel();

  // VERIFY
  await cancelPage.verifyCancelled(cancelAppointmentData.appointmentNo);


  // API LOG
  api.stopCapture();
  await api.saveFiles("cancel-appointment-api");
});
