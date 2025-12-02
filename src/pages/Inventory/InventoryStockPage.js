export class InventoryStockPage {
  constructor(page) {
    this.page = page;

    this.inventoryMenu = page.getByRole("link", { name: /Inventory/i });
    this.stockManagementBtn = page.getByRole("button", { name: "Stock Management" });
    this.addStockBtn = page.getByRole("button", { name: "Add stock" });
    this.updateStockBtn = page.getByRole("button", { name: "Update stock" });

    // Toast
    this.successToast = page.getByText("Stocks added successfully");
  }

  async openStockManagement() {
    await this.inventoryMenu.click();
    await this.stockManagementBtn.click();
  }

async selectItemForStock(itemName, itemCode) {
  await this.addStockBtn.click();

  const accordionItem = this.page.locator('.MuiAccordionSummary-root')
    .filter({ has: this.page.locator(`h6:has-text("${itemName}")`) });

  await accordionItem.first().click();
}


  getRegion(itemLabel) {
    return this.page.getByRole("region", { name: itemLabel });
  }

  async addStock(itemLabel, stockData) {
    const region = this.getRegion(itemLabel);

    await region.locator("#quantity").fill(stockData.quantity);
    await region.locator("#batchNumber").fill(stockData.batch);
    await region.locator("#unitCost").fill(stockData.unitCost);

    // Expiry month & year
    await region.locator("#expiryMonth").click();
    await this.page.getByRole("option", { name: stockData.expiryMonth }).click();

    await region.locator("#expiryYear").click();
    await this.page.getByRole("option", { name: stockData.expiryYear }).click();

    // Manufacture month
    await region.locator("#manufactureMonth").click();
    await this.page.getByRole("option", { name: stockData.manufactureMonth }).click();

    // Manufacture year
    await region.locator("#manufactureYear").click();
    await this.page.getByRole("option", { name: stockData.manufactureYear }).click();

    // Add & Update
    await this.page.getByRole("button", { name: "Add", exact: true }).click();
    await this.updateStockBtn.click();
  }

  async waitForSuccess() {
    await this.successToast.waitFor({ state: "visible" });
  }
}
