import { test, expect } from "@playwright/test";
import { InventoryStockPage } from "../../pages/Inventory/InventoryStockPage.js";
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";
import { inventoryStockData } from "../../testdata/inventory-stock-data.js";

test("Add stock for an inventory item", async ({ page }, testInfo) => {
  const api = new ApiInterceptor(page, testInfo);

      const login = new LoginPage(page);
      await login.navigate();
      await login.login(credentials.email, credentials.password);
  
      // SELECT ESTABLISHMENT
      const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
      await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
      await establishmentDropdown.click();
      await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

  const stockPage = new InventoryStockPage(page);
  const data = inventoryStockData.addStock;

  await stockPage.openStockManagement();
    api.startCapture();
  await stockPage.selectItemForStock(data.itemName, data.itemCode);

  await stockPage.addStock(data.regionLabel, data);
  await stockPage.waitForSuccess();

  await expect(page.getByText("Stocks added successfully")).toBeVisible();

  api.stopCapture();
  await api.saveFiles("add-stock");
});
