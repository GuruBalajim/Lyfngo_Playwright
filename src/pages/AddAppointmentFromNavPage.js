export class AddAppointmentFromNavPage {

    constructor(page) {
        this.page = page;

        // Buttons
        this.addAppointmentBtn = page.getByRole('button', { name: 'Add Appointment' });
        this.nextBtn = page.getByRole('button', { name: 'Add Appointment' });
        this.okBtn = page.getByRole('button', { name: 'OK' });

        // Patient Search
        this.searchBox = page.getByRole('textbox', { name: 'Search by name / Mobile' });

        // Date Picker
        this.dateField = page.getByRole('textbox', { name: 'Choose date, selected date is' });
        this.dateOption = (dateLabel) => page.getByRole('button', { name: dateLabel });

        // Specialist (Doctor)
        this.specialistDropdown = page.getByRole('combobox', { name: 'Specialist name *' });
        this.specialistOption = (name) => page.getByRole('option', { name });

        // Payment Method
        this.paymentMethodLabel = page.locator('label:has-text("Payment methods")');
        this.paymentOption = (method) => page.getByRole('option', { name: method });
    }

    // ---------------------------------------------------
    // ACTION METHODS
    // ---------------------------------------------------

    async openAddAppointment() {
        await this.addAppointmentBtn.click();
    }
async searchPatient(name) {
  await this.searchBox.fill(name);

  const row = this.page
    .locator(`text=${name} (p`)
    .first();

  await row.waitFor({ state: 'visible' });
  await row.click();
}


    async selectDate(dateLabel) {
        await this.dateField.click();
        await this.dateOption(dateLabel).click();
        await this.okBtn.click();
    }

    async selectDoctor(doctorName) {
        await this.specialistDropdown.click();
        await this.specialistOption(doctorName).click();
    }

    // async selectPaymentMethod(method) {
    //     await this.paymentMethodLabel.click();
    //     await this.paymentOption(method).click();
    // }

    async clickNext() {
        await this.nextBtn.click();
    }

    // ---------------------------------------------------
    // FULL ADD APPOINTMENT FLOW
    // ---------------------------------------------------

    async addAppointmentFlow(searchKey, dateLabel, doctorName, paymentMethod) {

        // Step 1: Add Appointment
        await this.openAddAppointment();

        // Step 2: Select patient (first matching row)
        await this.searchPatient(searchKey);

        // Step 3: Select Date
        await this.selectDate(dateLabel);

        // Step 4: Select Doctor
        await this.selectDoctor(doctorName);

        // Step 5: Click Add Appointment again
        await this.openAddAppointment();

        // Step 6: Payment Method
        // await this.selectPaymentMethod(paymentMethod);

        // Step 7: Next / Submit
        await this.clickNext();
    }
}
