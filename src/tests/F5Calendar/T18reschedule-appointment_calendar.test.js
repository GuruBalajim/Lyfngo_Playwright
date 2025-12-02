import { test, expect } from '@playwright/test';
import { CalendarPage } from '../../pages/CalendarPage.js';
import { AddAppointmentModalcalendar } from '../../pages/AddAppointmentModalcalendar.js';
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";

test('Reschedule Appointment From Calendar', async ({ page }, testInfo) => {

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
  await page.getByRole('option', { name: 'Non_care' }).click();

    const calendar = new CalendarPage(page);
    const modal = new AddAppointmentModalcalendar(page);
     api.startCapture();
    // OPEN CALENDAR
    await calendar.openCalendar();
    await calendar.switchToDayView();

    // OPEN FIRST APPOINTMENT
    await calendar.openFirstAppointmentTile();

    // CLICK RESCHEDULE
    
        const newTime = "01:30 PM";
    await modal.editAppointmentTime(newTime);
    


    await expect(page.getByText("Appointment updated")).toBeVisible();
    // VALIDATE SUCCESS MESSAGE
    await calendar.verifyAppointmentTimeUpdated(newTime);

    // SAVE API LOGS
     api.stopCapture();
    await api.saveFiles("Reschedule-Appointment-Calendar");
});
