import { test, expect } from '@playwright/test';
import { CalendarPage } from '../../pages/CalendarPage.js';
import { AddAppointmentModalcalendar } from '../../pages/AddAppointmentModalcalendar.js';
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";
test('Edit Calendar Reminder', async ({ page }, testInfo) => {
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

    // OPEN CALENDAR
    await calendar.openCalendar();
    api.startCapture()
    await calendar.switchToDayView();

    // OPEN FIRST REMINDER TILE
  const originalTitle = "test";
    await calendar.openReminderFromSideList(originalTitle);

    // EDIT REMINDER
    const updatedTitle = "test test";
    await modal.editCalendarReminder(updatedTitle);

    // VERIFY UPDATED IN SIDE LIST
    await calendar.verifyReminderUpdatedInSideList(updatedTitle);
    api.stopCapture();
    await api.saveFiles("Edit-Calendar-Reminder");
});
