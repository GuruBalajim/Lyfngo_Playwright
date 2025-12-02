// src/pages/CalendarPage.js

export class CalendarPage {
    constructor(page) {
        this.page = page;

        // MAIN CALENDAR MENU
        this.calendarMenu = page.getByRole('link', { name: /calendar/i });

        // VIEW SWITCH
        this.dayViewBtn = page.getByRole('button', { name: 'Day', exact: true });
        this.weekViewBtn = page.getByRole('button', { name: 'Week' });
        this.monthViewBtn = page.getByRole('button', { name: 'Month' });

        // COMMON LOCATORS
        this.timeSlots = page.locator('.fc-timegrid-slot');
        this.slotLabels = page.locator('.fc-timegrid-slot-label');
        this.events = page.locator('.fc-event, .fc-timegrid-event');

        // QUEUE COUNT (Specialist view)
        this.queueCountLabel = page.locator('.queue-count');
        
    }

    // ============================================================
    // OPEN CALENDAR
    // ============================================================
    async openCalendar() {
        await this.calendarMenu.click();
        await this.page.waitForLoadState('networkidle');
    }

    // ============================================================
    // VIEW SWITCHERS
    // ============================================================
    async switchToDayView() {
        await this.dayViewBtn.click();
        await this.page.waitForTimeout(300);
    }

    async switchToWeekView() {
        await this.weekViewBtn.click();
        await this.page.waitForTimeout(300);
    }

    async switchToMonthView() {
        await this.monthViewBtn.click();
        await this.page.waitForTimeout(300);
    }

    // ============================================================
    // CLICK FIRST AVAILABLE TIME SLOT
    // Very stable — always works.
    // ============================================================
    async clickFirstAvailableSlot() {
        const slot = this.timeSlots.first();
        await slot.scrollIntoViewIfNeeded();
        await slot.click({ force: true });
    }

    // ============================================================
    // CLICK SLOT BY INDEX
    // Best for predictable placement.
    // ============================================================
    async clickTimeSlotByIndex(index = 5) {
        const slot = this.timeSlots.nth(index);

        await slot.waitFor({ state: "visible", timeout: 10000 });
        await slot.scrollIntoViewIfNeeded();
        await slot.click({ force: true });
    }
async clickDaySheetRow(rowNo = 12) {
    const slot = this.page.locator(
        `tr:nth-child(${rowNo}) > .fc-timegrid-slot.fc-timegrid-slot-lane`
    );

    await slot.waitFor({ state: 'visible', timeout: 10000 });
    await slot.click({ force: true });
}

    // ============================================================
    // CLICK NEXT EMPTY SLOT (Smart Auto Detection)
    // Skips slots that already have appointments.
    // ============================================================
    async clickNextEmptySlot() {
        const total = await this.timeSlots.count();

        for (let i = 0; i < total; i++) {
            const slot = this.timeSlots.nth(i);

            // Check if slot has an event
            const hasEvent = await slot.locator('.fc-timegrid-event').count();

            if (hasEvent === 0) {
                await slot.scrollIntoViewIfNeeded();
                await slot.click({ force: true });
                console.log(`✔ Clicked empty slot at index ${i}`);
                return;
            }
        }

        throw new Error("❌ No empty slot found on calendar.");
    }
    // AUTO SELECT NEXT EMPTY DAY SHEET SLOT
async clickNextTrueAvailableSlot(startRow = 1) {
    // Count all rows in Day Sheet grid
    const totalRows = await this.page.locator('tr').count();

    for (let i = startRow; i <= totalRows; i++) {

        const slot = this.page.locator(
            `tr:nth-child(${i}) > .fc-timegrid-slot.fc-timegrid-slot-lane`
        );

        if (!await slot.isVisible()) continue;

        // 🟡 Check if THIS row has an event inside it
        const directBooked = await slot.locator('.fc-timegrid-event').count();

        if (directBooked > 0) {
            console.log(`⛔ Row ${i} booked → skipping`);
            continue;
        }

        // 🟡 Check if slot is covered by LONG EVENT (2 hours block)
        const overlappingEvent = await this.page.locator(
            `.fc-timegrid-event.fc-event:near(tr:nth-child(${i}))`
        ).count();

        if (overlappingEvent > 0) {
            console.log(`⛔ Row ${i} covered by long event → skipping`);
            continue;
        }

        // If reached here → Slot is truly free
        await slot.scrollIntoViewIfNeeded();
        await slot.click({ force: true });

        console.log(`✔ Clicked empty slot at row ${i}`);
        return;
    }

    throw new Error("❌ No empty slot available in Day Sheet (multi-hour aware).");
}



    // ============================================================
    // CLICK APPOINTMENT TILE BY TEXT (ex: "Test Patient")
    // ============================================================
    async openFirstAppointmentTile() {
    const event = this.page.locator("a.fc-timegrid-event, a.fc-event").first();

    await event.waitFor({ state: "visible", timeout: 10000 });
    await event.click();
}
async openAppointmentByPatient(name) {
    const tile = this.page.locator('a').filter({ hasText: name }).first();
    await tile.waitFor({ state: "visible" });
    await tile.click();
}


    // ============================================================
    // OPEN APPOINTMENT DETAILS
    // Identifies appointment tiles by time or text.
    // ============================================================
    async openAppointmentDetails(timeRange) {
        console.log(`🔍 Looking for event: ${timeRange}`);

        // 1️⃣ Exact match
        let locator = this.page.getByText(timeRange, { exact: true });

        if (await locator.count() > 0) {
            await locator.first().click();
            return;
        }

        // 2️⃣ Regex fallback
        const normalized = timeRange.replace(/\s+/g, "\\s*");
        const regex = new RegExp(normalized, "i");

        locator = this.page.locator(`text=${regex}`);
        if (await locator.count() > 0) {
            await locator.first().click();
            return;
        }

        // 3️⃣ Match only start time
        const startTime = timeRange.split(/-|to/i)[0].trim();
        locator = this.events.filter({ hasText: startTime }).first();

        await locator.waitFor({ state: 'visible', timeout: 15000 });
        await locator.click();
    }

    // ============================================================
    // SELECT DOCTOR FROM LIST
    // ============================================================
    async selectDoctor(name) {
        const doctor = this.page.getByText(name, { exact: true });
        await doctor.waitFor({ state: "visible", timeout: 8000 });
        await doctor.click();
    }

    // ============================================================
    // GET QUEUE COUNT
    // ============================================================
    async getQueueCount() {
        await this.queueCountLabel.waitFor({ state: "visible", timeout: 8000 });
        return Number(await this.queueCountLabel.innerText());
    }
    async openAppointmentByRow(rowNo) {
    const slotEvent = this.page.locator(
        `tr:nth-child(${rowNo}) .fc-timegrid-event`
    ).first();

    await slotEvent.waitFor({ state: "visible", timeout: 10000 });
    await slotEvent.click();
}
async openFirstBookedAppointment() {
    const events = this.page.locator(".fc-timegrid-event");
    const count = await events.count();

    if (count === 0) {
        throw new Error("❌ No booked appointments found on the calendar.");
    }

    const firstEvent = events.first();

    await firstEvent.waitFor({ state: "visible", timeout: 10000 });
    await firstEvent.click();
}

async openFirstActiveAppointment() {
    const events = this.page.locator("a.fc-timegrid-event, a.fc-event");
    const count = await events.count();

    for (let i = 0; i < count; i++) {
        const tile = events.nth(i);
        const text = (await tile.innerText()).toLowerCase();

        if (
            text.includes("cancel") ||
            text.includes("no show") ||
            text.includes("completed")
        ) continue;

        await tile.scrollIntoViewIfNeeded();
        await tile.click();
        return;
    }

    throw new Error("❌ No active appointment available to edit.");
}
async verifyAppointmentTimeUpdated(newTime) {
    const updatedTile = this.page.locator("a.fc-timegrid-event").filter({ hasText: newTime });

    await updatedTile.waitFor({ state: "visible", timeout: 8000 });

    console.log(`✔ Appointment time updated to: ${newTime}`);
}

async verifyBlockCalendar(reason) {
    const blockCard = this.page.locator("a").filter({ hasText: reason }).first();
    await blockCard.waitFor({ state: "visible", timeout: 8000 });
}
// CLICK FIRST BLOCK CALENDAR TILE
async openFirstBlockCalendarTile() {
    const blocks = this.page.locator('a').filter({
        hasText: /leave|block|prabhu|calendar|break/i
    });

    const count = await blocks.count();
    if (count === 0) throw new Error("❌ No block calendar found");

    const blockTile = blocks.first();
    await blockTile.scrollIntoViewIfNeeded();
    await blockTile.click();

    return blockTile;   // return so we can extract clean text
}


async verifyBlockCalendarDeleted(reason) {
    const block = this.page.locator("a").filter({ hasText: reason });

    await expect(block).toHaveCount(0);   // block should disappear
    console.log("✔ Block calendar deleted successfully");
}
async verifyCalendarReminder(title) {
    const locator = this.page.locator('a').filter({ hasText: title }).first();
    await locator.waitFor({ state: 'visible', timeout: 8000 });
}

async openFirstReminderTile() {
    const tile = this.page.locator('a').filter({
        hasText: /reminder|pm|am|test/i
    }).first();

    await tile.waitFor({ state: 'visible', timeout: 8000 });
    await tile.click();

    return tile;
}
async openReminderPopupFromTile(tile) {
    const text = await tile.innerText();
    const dateTimeLine = text.split("\n").find(l => l.match(/\d{2}:\d{2}\s(AM|PM)/));

    await this.page.getByText(dateTimeLine).click();
}

async verifyReminderUpdated(newTitle) {
    const reminder = this.page.locator('a').filter({ hasText: newTitle }).first();
    await reminder.waitFor({ state: 'visible', timeout: 8000 });
}

async openReminderFromSideList(title) {
    const item = this.page.locator('div').filter({
        hasText: new RegExp(`Reminder for - ${title}`, "i")
    }).nth(1);

    await item.waitFor({ state: "visible", timeout: 10000 });
    await item.click();

    return item;
}

async verifyReminderUpdatedInSideList(title) {
    const reminder = this.page.locator('div').filter({
        hasText: new RegExp(`Reminder for - ${title}`, "i")
    });

    await reminder.first().waitFor({ state: 'visible', timeout: 10000 });
}

async verifyReminderDeletedFromSideList(title) {
    const locator = this.page.locator('div').filter({
        hasText: new RegExp(`Reminder for - ${title}`, "i")
    });

   
}


}
