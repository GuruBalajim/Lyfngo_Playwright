import { test } from "@playwright/test";
import { CalendarPage } from "../../pages/CalendarPage.js";
import { AddAppointmentModalcalendar } from "../../pages/AddAppointmentModalcalendar.js";
import { LoginPage } from "../../pages/LoginPage.js";
import { credentials } from "../../testdata/credentials.js";
import { addAppointmentData } from "../../testdata/appointmentData_calendar.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";

test('Add appointment from calendar', async ({ page }, testInfo) => {

  // API Capture init
  const api = new ApiInterceptor(page, testInfo);
 

  // LOGIN FLOW
  const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);
  await page.waitForTimeout(2000);

  // SELECT ESTABLISHMENT
  const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
  await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
  await establishmentDropdown.click();
  await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

  api.startCapture();   // START API RECORDING

  // PAGE OBJECTS
 const calendarPage = new CalendarPage(page);
    const addModal = new AddAppointmentModalcalendar(page);

   //1️⃣ Open Calendar
    await calendarPage.openCalendar();

    // 2️⃣ Click FIRST available time slot (no time needed)
    await page.locator('.fc-timegrid-slot-lane').first().click();

    // 3️⃣ Search patient
    await addModal.searchPatient(addAppointmentData.patientName);
    // Example: "guru"

    // 4️⃣ Select specialist
    await addModal.selectSpecialist(addAppointmentData.specialist);
    // "Dr. Vicky"

    // 5️⃣ Select duration
    await addModal.selectDuration();

    // 6️⃣ Save appointment
    await addModal.saveAppointment();

    // 7️⃣ Verify appointment tile appears
    await calendarPage.clickAppointmentTile(addAppointmentData.appointmentTileText);

  api.stopCapture();  // STOP API RECORDING

  await api.saveFiles("add-calendar-appointment-api");
});
