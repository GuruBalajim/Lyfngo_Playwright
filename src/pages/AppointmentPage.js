export class AppointmentPage {
  constructor(page) {
    this.page = page;

    this.dateInput = page.getByRole('textbox', { name: /Choose date/i });

    this.timeDropdown = page.getByRole('combobox', { name: /Time/i });
    this.durationDropdown = page.getByRole('combobox', { name: /Duration/i });
    this.doctorDropdown = page.getByRole('combobox', { name: /Specialist name/i });

    this.saveBtn = page.getByRole('button', { name: 'Add Appointment' });
  }

  async openPatient(name) {
    await this.page.getByRole('link', { name: 'icon Patients' }).click();
    await this.page.getByRole('heading', { name }).click();
  }

  async openAppointmentTab() {
    await this.page.getByRole('button', { name: 'Appointment Appointment' }).click();
  }

  async openAddAppointmentForm() {
    await this.page.getByRole('button', { name: 'Add appointment', exact: true }).click();
  }

  async selectDate(dayText) {
    await this.dateInput.click();
    await this.page.getByRole('button', { name: new RegExp(dayText, "i") }).click();
    await this.page.getByRole('button', { name: "OK" }).click();
  }

  async selectTime(time) {
    await this.timeDropdown.click();
    await this.page.getByRole('option', { name: time }).click();
  }

  async selectDuration(duration) {
    await this.durationDropdown.click();
    await this.page.getByRole('option', { name: duration, exact: true }).click();
  }

  async selectDoctor(doctorName) {
    await this.doctorDropdown.click();
    await this.page.getByRole('option', { name: doctorName }).click();
  }

  async saveAppointment() {
    await this.saveBtn.click();
  }

  async verifyAppointment(dateText) {
    await this.page.waitForSelector(`text=${dateText}`);

  }
  async deleteBlockCalendar() {

    // Click delete button
    await this.page.getByRole('button', { name: /delete/i }).click();

    // Confirm popup
    await this.page.getByRole('button', { name: /yes|confirm|ok/i }).click();

    // Wait for success message
    await this.page.getByText(/deleted|block removed|success/i).waitFor({ timeout: 8000 });
}
}
