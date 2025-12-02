export class LeadsPage {
  constructor(page) {
    this.page = page;

    this.leadsLink = page.getByRole("link", { name: "icon Leads" });
    this.addLeadBtn = page.getByRole("button", { name: "Add Lead" });

    this.leadName = page.getByRole("textbox", { name: "Lead Name *" });
    this.mobileNumber = page.getByRole("textbox", { name: "Mobile number *" });

    this.saveBtn = page.getByRole("button", { name: "Save" });
  }

  async gotoLeads() {
    await this.leadsLink.click();
  }

  async openAddLead() {
    await this.addLeadBtn.click();
  }

  async fillLeadForm(data) {
    await this.leadName.fill(data.name);
    await this.mobileNumber.fill(data.mobile);
  }

  async saveLead() {
    await this.saveBtn.click();
  }

  async openLeadFromList(name, mobile) {
    await this.page
      .locator("div")
      .filter({
        hasText: new RegExp(`${name}.*${mobile}`, "i")
      })
      .first()
      .click();
  }

async convertLeadToCustomer(leadName) {

  // 1️⃣ Click correct lead card
  const leadCard = this.page.locator("div.MuiCard-root").filter({
    has: this.page.getByRole("heading", { name: leadName, exact: true })
  });

  await leadCard.waitFor({ state: "visible" });
  await leadCard.first().click();

  // 2️⃣ Click status dropdown (parent of text "Lead")
  const leadStatus = this.page.getByText("Lead", { exact: true });
  await leadStatus.waitFor({ state: "visible" });
  await leadStatus.locator("..").click(); // ✅ important fix

  // 3️⃣ Select Customer
  const customerOption = this.page.getByRole("option", { name: "Customer" });
  await customerOption.waitFor({ state: "visible" });
  await customerOption.click();
}


}