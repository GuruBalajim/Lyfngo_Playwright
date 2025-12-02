export class RescheduleAppointmentPage {
  constructor(page) {
    this.page = page;

    this.patientsMenu = page.getByRole('link', { name: 'icon Patients' });
    this.dateInput = page.getByRole('textbox', { name: /Choose date/i });
    this.timeDropdown = page.getByRole('combobox', { name: /Select time/i });
    this.rescheduleBtn = page.getByRole('button', { name: 'Reschedule' });
  }

  async openPatient(name) {
    await this.patientsMenu.click();
    await this.page.getByRole('heading', { name }).click();
  }

  async openAppointmentTab() {
    await this.page.getByRole('button', { name: 'Appointment Appointment' }).click();
  }

  async openAppointmentMenu() {
    // You gave this selector for menu button
    await this.page
      .locator('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12 > div:nth-child(5) > .MuiButtonBase-root')
      .first()
      .click();
  }

  async chooseRescheduleOption() {
    await this.page.getByRole('menuitem', { name: 'Reschedule' }).click();
  }

  async selectNewDate(dateText) {
    await this.dateInput.click();
    await this.page.getByRole('button', { name: new RegExp(dateText, "i") }).click();
    await this.page.getByRole('button', { name: "OK" }).click();
  }

  async selectNewTime(time) {
    await this.timeDropdown.click();
    await this.page.getByRole('option', { name: time }).click();
  }

  async confirmReschedule() {
    await this.rescheduleBtn.click();
  }

async verifyRescheduled(dateText, timeText) {
  const row = this.page.locator('div.MuiGrid-root')
    .filter({ hasText: dateText })
    .filter({ hasText: timeText })
    .first();

  await row.waitFor({ timeout: 60000 });
}

}
