export class DeliveryOrderPage {
  constructor(page) {
    this.page = page;

    this.batchInput = page.getByRole("textbox", { name: "Batch number*" });
    this.monthDropdown = page.getByRole("combobox", { name: "Month" });
    this.yearDropdown = page.getByRole("combobox", { name: "Year" });

    this.updateBtn = page.getByRole("button", { name: "Update", exact: true });
    this.deliveredHead = page.getByRole("heading", { name: "Delivered" });
  }

  getRow(poNumber) {
    return this.page
      .locator(".MuiDataGrid-row")
      .filter({ has: this.page.getByText(poNumber) });
  }

  getDeliveryOrderButton(poNumber) {
    return this.getRow(poNumber).getByLabel("Delivery Order");
  }

  getStatusButton(poNumber) {
    return this.getRow(poNumber).getByLabel("Status");
  }

  async openDeliveryOrder(poNumber) {
    await this.getDeliveryOrderButton(poNumber).click();
  }

  async fillBatch(batch) {
    await this.batchInput.fill(batch);
  }

  async selectExpiry(month, year) {
    await this.monthDropdown.click();
    await this.page.getByRole("option", { name: month }).click();

    await this.yearDropdown.click();
    await this.page.getByRole("option", { name: year }).click();
  }

  async updateDelivery() {
    await this.updateBtn.click();
  }

  async goToDeliveredTab() {
    await this.deliveredHead.first().click();
  }

  async openStatus(poNumber) {
    await this.getStatusButton(poNumber).click();
  }
}
