import { test, expect } from '@playwright/test';
import { CalendarPage } from '../../pages/CalendarPage.js';
import { AddAppointmentModalcalendar } from '../../pages/AddAppointmentModalcalendar.js';
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";


test('Add Block Calendar', async ({ page }, testInfo) => {

    const api = new ApiInterceptor(page, testInfo);
   


  

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

    const calendar = new CalendarPage(page);
    const modal = new AddAppointmentModalcalendar(page);
    // CALENDAR
    await calendar.openCalendar();
     api.startCapture();
    await calendar.switchToDayView();
   
    // BLOCK CALENDAR
    const reason = "Block for leave";
    const doctor = "Dr. Prabhu";

    await modal.addBlockCalendar(reason, doctor, "In-Person");

    // VALIDATE BLOCK CREATED
    await calendar.verifyBlockCalendar(reason);

    // API LOGS
     api.stopCapture();
    await api.saveFiles("Block-Calendar");
});
