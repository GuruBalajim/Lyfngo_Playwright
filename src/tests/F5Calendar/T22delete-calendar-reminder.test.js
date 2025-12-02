import { test, expect } from '@playwright/test';
import { CalendarPage } from '../../pages/CalendarPage.js';
import { AddAppointmentModalcalendar } from '../../pages/AddAppointmentModalcalendar.js';
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";

test('Delete Calendar Reminder from side list', async ({ page }, testInfo) => {
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
    api.startCapture();
    await calendar.switchToDayView();

    // TITLE OF REMINDER TO DELETE
    const reminderTitle = "test"; // replace if needed

    // OPEN REMINDER FROM SIDE PANEL
    await calendar.openReminderFromSideList(reminderTitle);

    // DELETE REMINDER
    await modal.deleteCalendarReminder();

    // VERIFY REMINDER IS REMOVED
    await calendar.verifyReminderDeletedFromSideList(reminderTitle);

    // API LOGS
     api.stopCapture();
    await api.saveFiles("Delete-Calendar-Reminder");
});
