export class EditItemModal {
  constructor(page) {
    this.page = page;

    this.retailPrice = page.getByRole("spinbutton", { name: "Retail price *" });
    this.itemNumber = page.getByRole("textbox", { name: "Item number *" });
    this.saveBtn = page.getByRole("button", { name: "Save" });
  }

  async updateItem({ price, itemNumber }) {
    if (price) {
      await this.retailPrice.fill(price);
    }

    if (itemNumber) {
      await this.itemNumber.fill(itemNumber);
    }

    await this.saveBtn.click();
  }
}
