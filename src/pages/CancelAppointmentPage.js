export class CancelAppointmentPage {
  constructor(page) {
    this.page = page;
    this.patientsMenu = page.getByRole('link', { name: 'icon Patients' });
  }

  async openPatient(name) {
    await this.patientsMenu.click();
    await this.page.getByRole('heading', { name }).click();
  }

  async openAppointmentTab() {
    await this.page.getByRole('button', { name: 'Appointment Appointment' }).click();
  }

  async openAppointmentCard() {
    // Appointment list container – very stable
    await this.page.locator('.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2').first().click();
  }

  async clickAppointmentMenu() {
    // The 3-dot menu button – CodeGen found this reliably
    await this.page
      .locator('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12 > div:nth-child(5) > .MuiButtonBase-root')
      .first()
      .click();
  }

  async selectCancelOption() {
    await this.page.getByRole('menuitem', { name: /Cancel Appointment/i }).click();
  }

  async selectReason(reason) {
    await this.page.getByRole('combobox', { name: /Reason/i }).click();
    await this.page.getByRole('option', { name: reason }).click();
  }

  async confirmCancel() {
    // Check Email checkbox
    await this.page.getByRole('checkbox', { name: 'Email' }).nth(1).check();

    // Final cancel
    await this.page.getByRole('button', { name: /Cancel Appointment/i }).click();
  }

  async verifyCancelled(appointmentNo) {
    // Go to Cancelled section
    await this.page.getByText('Cancelled').first().click();

    // Click cancelled appointment card
    await this.page.getByText(appointmentNo).click();
  }
}