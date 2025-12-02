import { test, expect } from '@playwright/test';
import { CalendarPage } from '../../pages/CalendarPage.js';
import { AddAppointmentModalcalendar } from '../../pages/AddAppointmentModalcalendar.js';
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";
test('Delete Block Calendar', async ({ page }, testInfo) => {

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

    // CLICK FIRST BLOCK CALENDAR
// Extract clean reason text from tile
 const blockTile = await calendar.openFirstBlockCalendarTile();

// extract clean reason (ONLY "reason - doctor")
const tileText = await blockTile.innerText();
const lines = tileText.split("\n").map(t => t.trim());
const reason = lines.find(l => l.includes(" - "));

console.log("DELETING BLOCK:", reason);

await modal.deleteBlockCalendar_viaMoreConfirm();

// verify it's removed
await expect(page.locator(`a:has-text("${reason}")`)).toHaveCount(0);



    // API LOGS
    api.stopCapture();
    await api.saveFiles("Delete-Block-Calendar");
});
