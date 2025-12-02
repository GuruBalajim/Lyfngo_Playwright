export class PatientPage {
  constructor(page) {
    this.page = page;

    this.addPatientButton = page.getByRole('button', { name: 'Add Patient' });
    this.nameField = page.getByRole('textbox', { name: 'Patient name *' });
    this.phoneField = page.getByRole('textbox', { name: 'Mobile number *' });

    this.moreButton = page.getByRole('button', { name: '+ Add more' });

    this.stateDropdown = page.locator("div").filter({ hasText: /^State \*$/ });
    this.postalCodeField = page.getByRole('textbox', { name: 'Postcode *' });

    this.ageField = page.getByRole('textbox', { name: 'Age' });
    this.emailField = page.getByRole('textbox', { name: 'Email' });
    this.dobField = page.getByRole('textbox', { name: 'DOB' });
    this.addressField = page.getByRole('textbox', { name: 'Address' });

    this.bloodGroupDropdown = page.getByRole('combobox', { name: 'Blood group' });
    this.occupationDropdown = page.getByRole('combobox', { name: 'Occupation' });

    // ✅ Insurance number is TEXT FIELD, not dropdown
    this.insuranceNumberField = page.getByRole('textbox', { name: 'Insurance number' });

    this.referralDropdown = page.getByRole('combobox', { name: 'How did you hear about us' });
    this.timezoneDropdown = page.getByRole('combobox', { name: 'Select Time Zone *' });

    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  // ✅ Safe Add Patient button click (fixes overlay issue)
async openAddPatientForm() {
  await this.page.waitForLoadState('networkidle');

  const addPatientBtn = this.page.getByRole('button', { name: /add patient/i });
  await addPatientBtn.waitFor({ timeout: 60000 });
  await addPatientBtn.click();

  // ✅ Wait for REAL Patient Name field
  this.nameField = this.page.getByRole('textbox', { name: /Patient name \*/i });
  await this.nameField.waitFor({ state: 'visible', timeout: 60000 });
}
  async fillBasicDetails(name, phone) {
    await this.nameField.fill(name);
    await this.phoneField.fill(phone);
  }

  async expandMoreDetails() {
    await this.moreButton.waitFor({ state: 'visible' });
    await this.moreButton.click({ force: true });
  }

  async selectState(state) {
    await this.stateDropdown.click({ force: true });
    await this.page.getByRole('option', { name: state }).click();
  }

  async fillPostalCode(code) {
    await this.postalCodeField.fill(code);
  }

  async fillAdditionalDetails(data) {

    await this.ageField.fill(data.age);
    await this.emailField.fill(data.email);
    await this.dobField.fill(data.dob);
    await this.addressField.fill(data.address);

    // ✅ SAFE Blood Group selection
    await this.bloodGroupDropdown.click({ force: true });
    await this.page
      .locator('.MuiAutocomplete-option')
      .filter({ hasText: data.bloodGroup })
      .first()
      .click();

    // Occupation
    await this.occupationDropdown.click({ force: true });
    await this.page.getByRole('option', { name: data.occupation }).click();

    // ✅ Insurance Number TEXT
    await this.insuranceNumberField.fill(data.insuranceNumber);

    // Referral
    await this.referralDropdown.fill(data.referralSource);
    await this.page.getByRole('option', { name: `Add "${data.referralSource}"` }).click();

    // Timezone
    await this.timezoneDropdown.click({ force: true });
    await this.page.getByRole('option', { name: data.timezone }).click();
  }

  // ✅ Safe Save button click
  async save() {
    await this.saveButton.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(500);
    await this.saveButton.click({ force: true });
  }
}
