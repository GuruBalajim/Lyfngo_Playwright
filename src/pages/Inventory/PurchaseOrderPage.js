export class PurchaseOrderPage {
  constructor(page) {
    this.page = page;

    this.stockManagementBtn = page.getByRole("button", { name: "Stock Management" });
    this.purchaseOrderTab = page.getByRole("tab", { name: "Purchase Order" });

    this.createPurchaseBtn = page.getByRole("button", { name: "Create Purchase" });

    // Form fields
    this.vendorDropdown = page.getByRole("combobox", { name: "Vendor Name*" });
    this.itemDropdown = page.getByRole("combobox", { name: "Item*" });

    this.qtyInput = page.getByRole("spinbutton", { name: "Quantity*" });
    this.unitPriceInput = page.getByRole("spinbutton", { name: "Unit price*" });

    this.addItemBtn = page.getByRole("button", { name: "Add" });
    this.raiseBtn = page.getByRole("button", { name: "Raise" });

    // Toast
    this.successToast = page.getByText("Purchase order added");
  }

  async openPurchaseOrderTab() {
    await this.stockManagementBtn.click();
    await this.purchaseOrderTab.click();
  }

  async createNewPurchase() {
    await this.createPurchaseBtn.click();
  }

  async selectVendor(vendorName) {
    await this.vendorDropdown.click();
    await this.page.getByRole("option", { name: vendorName }).click();
  }

  async selectItem(itemName) {
    await this.itemDropdown.click();
    await this.page.getByRole("option", { name: itemName, exact: true }).click();
  }

  async fillQty(qty) {
    await this.qtyInput.fill(qty);
  }

  async fillUnitPrice(price) {
    await this.unitPriceInput.fill(price);
  }

  async addItem() {
    await this.addItemBtn.click();
  }

  async raiseOrder() {
    await this.raiseBtn.click();
  }

  async waitForSuccess() {
    await this.successToast.waitFor({ state: "visible" });
  }
}
