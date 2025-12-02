// src/pages/AddAppointmentModalcalendar.js

export class AddAppointmentModalcalendar {
    constructor(page) {
        this.page = page;

        this.searchPatientBox = page.getByRole('textbox', {
            name: 'Search by name / Mobile'
        });

        this.specialistDropdown = page.locator('div').filter({
            hasText: /^Specialist name \*$/
        });

        this.durationCombobox = page.getByRole('combobox', { name: 'Duration*' });

        this.saveBtn = page.getByRole('button', { name: 'Add Appointment' });
    }

    // ============================
    // SEARCH PATIENT (NO REGEX)
    // ============================
    async searchPatient(name) {
 await this.searchPatientBox.fill(name);


  const row = this.page
    .locator(`text=${name} (p`)
    .first();

  await row.waitFor({ state: 'visible' });
  await row.click();
}

    async selectSpecialist(name) {
        await this.specialistDropdown.click();
        await this.page.getByRole('option', { name }).click();
    }

    async selectDuration() {
        await this.durationCombobox.click();
    }

    async saveAppointment() {
        await this.saveBtn.click();
    }

async bookAppointment(patientName, specialistName = null) {
    // 1️⃣ Search & select patient
    await this.searchPatient(patientName);

    // 2️⃣ Select specialist if available
    if (specialistName) {
        await this.selectSpecialist(specialistName);
    }

    // 3️⃣ Duration (if needed)
    // await this.selectDuration(); // uncomment if duration is mandatory

    // 4️⃣ Save appointment
    await this.saveAppointment();
}
async cancelAppointment() {
    const cancelBtn = this.page.getByRole('button', { name: /cancel appointment/i });
    await cancelBtn.waitFor({ state: 'visible', timeout: 10000 });
    await cancelBtn.click();

    const confirmBtn = this.page.getByRole('button', { name: /confirm/i });
    await confirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    await confirmBtn.click();
}

async getStatusText() {
    return await this.page.locator('text=Cancelled').first().innerText();
}
async cancelAppointmentFlow() {
    // Click cancel button in popup
    await this.page.getByRole('button', { name: 'Cancel' }).click();

    // Select Email checkbox
    await this.page.getByRole('checkbox', { name: 'Email' }).nth(1).check();

    // Select reason
    await this.page.getByRole('combobox', { name: 'Reason' }).click();
    await this.page.getByRole('option', { name: 'Other Reasons' }).click();

    // Final cancel button
    await this.page.getByRole('button', { name: 'Cancel appointment' }).click();
}
async rescheduleAppointment() {
    // Click Reschedule button
    await this.page.getByRole('button', { name: 'Reschedule' }).click();

    // Wait for calendar slots to be active
    await this.page.waitForTimeout(500);
}
async editAppointmentTime(newTime) {

    // Click Edit
    await this.page.getByRole('button', { name: 'Edit' }).click();

    // Time dropdown
    await this.page.getByRole('combobox', { name: /select time/i }).click();

    // Select new time
    await this.page.getByRole('option', { name: newTime }).click();

    // Click Update
    await this.page.getByRole('button', { name: 'Update' }).click();

    // Wait for popup message
    await this.page.getByText('Appointment updated').waitFor({ timeout: 8000 });

    return newTime; // return new time for verification
}


async addBlockCalendar(reason, specialistName, mode = "In-Person") {

    // Click Add Block Calendar
    await this.page.getByRole('button', { name: 'Add Block Calendar' }).click();

    // Enter leave detail
    await this.page.getByRole('textbox', { name: /leave detail/i }).fill(reason);

    // Select Specialist
    await this.page.getByRole('combobox', { name: /select specialist/i }).click();
    await this.page.getByRole('option', { name: specialistName }).click();

    // Select mode (In-Person / Virtual)
    await this.page.getByText(mode).click();

    // Save
    await this.page.getByRole('button', { name: 'Save' }).click();
}
async deleteBlockCalendar() {

    // Click delete button
    await this.page.getByRole('button', { name: /delete/i }).click();

    // Confirm popup
    await this.page.getByRole('button', { name: /yes|confirm|ok/i }).click();

    // Wait for success message
    await this.page.getByText(/deleted|block removed|success/i).waitFor({ timeout: 8000 });
}

// inside class AddAppointmentModalcalendar { ... }

async deleteBlockCalendar_viaMoreConfirm() {

    // Popup MORE button → uses aria-label="more"
    const moreBtn = this.page.locator('button[aria-label="more"]').first();
    await moreBtn.waitFor({ state: 'visible', timeout: 10000 });
    await moreBtn.click();

    // Delete menu item
    const deleteMenu = this.page.getByRole('menuitem', { name: /delete/i }).first();
    await deleteMenu.waitFor({ state: 'visible', timeout: 10000 });
    await deleteMenu.click();

    // YES confirmation
    const yesBtn = this.page.getByRole('button', { name: /^yes$/i }).first();
    await yesBtn.waitFor({ state: 'visible', timeout: 10000 });
    await yesBtn.click();

    // Wait until popup disappears OR success toast appears
    await Promise.race([
        this.page.getByText(/deleted|successfully deleted/i).waitFor({ timeout: 8000 }).catch(() => {}),
        this.page.locator('button[aria-label="more"]').waitFor({ state: 'detached', timeout: 8000 }).catch(() => {})
    ]);
}

async addCalendarReminder(title, doctorName, dateCellName = "Dec 1,", isAllDay = false) {

    // Open Add Reminder popup
    await this.page.getByRole('button', { name: 'Add Reminder' }).click();

    // Title
    await this.page.getByRole('textbox', { name: /reminder title/i }).fill(title);

    // Specialist
    await this.page.getByRole('combobox', { name: /select specialist/i }).click();
    await this.page.getByRole('option', { name: doctorName }).click();

    // All Day
    const allDay = this.page.getByRole('checkbox', { name: /all day/i });
    isAllDay ? await allDay.check() : await allDay.uncheck();

    // Date
    await this.page.getByRole('textbox', { name: /choose date/i }).click();
    await this.page.getByRole('cell', { name: dateCellName }).click();
    await this.page.getByRole('button', { name: 'OK' }).click();

    // Time
    await this.page.getByRole('textbox', { name: /choose time/i }).click();
    await this.page.locator('.css-1umqo6f').first().click();
    await this.page.getByRole('button', { name: 'OK' }).click();

    // Save
    await this.page.getByRole('button', { name: 'Save' }).click();

    // Exact success toast
    await this.page.getByText('Reminder added successfully').waitFor({ timeout: 8000 });
}async editCalendarReminder(newTitle) {

    // Click settings in popup (three dots)
    const settings = this.page.getByRole('button', { name: 'settings' }).nth(2);
    await settings.waitFor({ state: 'visible', timeout: 8000 });
    await settings.click();

    // Click Edit
    const editBtn = this.page.getByRole('menuitem', { name: 'Edit' });
    await editBtn.waitFor({ state: 'visible' });
    await editBtn.click();

    // Change time
    await this.page.getByRole('textbox', { name: /choose time/i }).click();
    await this.page.locator('.css-1umqo6f').first().click();
    await this.page.getByRole('button', { name: 'OK' }).click();

    // Edit title
    await this.page.getByRole('textbox', { name: 'Reminder title *' })
        .fill(newTitle);

    // Save
    await this.page.getByRole('button', { name: 'Save' }).click();

    // Wait for toast
    await this.page.getByText(/Reminder updated successfully/i)
        .waitFor({ timeout: 8000 });
}

async deleteCalendarReminder() {

    // Click settings button
    const settings = this.page.getByRole('button', { name: 'settings' }).nth(2);
    await settings.waitFor({ state: 'visible', timeout: 10000 });
    await settings.click();

    // Click Delete
    const deleteBtn = this.page.getByRole('menuitem', { name: /delete/i });
    await deleteBtn.waitFor({ state: 'visible', timeout: 10000 });
    await deleteBtn.click();

    // Confirm Yes
    const yesBtn = this.page.getByRole('button', { name: /^yes$/i }).first();
    await yesBtn.waitFor({ state: 'visible', timeout: 10000 });
    await yesBtn.click();

    // Wait for toast
    await this.page.getByText(/reminder deleted successfully|deleted/i)
        .waitFor({ timeout: 8000 });
}


}