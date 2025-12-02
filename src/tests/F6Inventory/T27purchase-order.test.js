import { test, expect } from "@playwright/test";
import { PurchaseOrderPage } from "../../pages/Inventory/PurchaseOrderPage.js";
import { InventoryPage } from "../../pages/Inventory/InventoryPage.js";
import { purchaseOrderData } from "../../testdata/purchase-order-data.js";
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";

test("Create a new purchase order", async ({ page }, testInfo) => {
  const api = new ApiInterceptor(page, testInfo);
 
 const login = new LoginPage(page);
      await login.navigate();
      await login.login(credentials.email, credentials.password);
  
      // SELECT ESTABLISHMENT
      const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
      await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
      await establishmentDropdown.click();
      await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

  const poPage = new PurchaseOrderPage(page);
  
    const inventory = new InventoryPage(page);
  const data = purchaseOrderData;
   await inventory.openInventory();
 api.startCapture();
  await poPage.openPurchaseOrderTab();
  await poPage.createNewPurchase();

  await poPage.selectVendor(data.vendorName);
  await poPage.selectItem(data.itemName);

  await poPage.fillQty(data.qty);
  await poPage.fillUnitPrice(data.unitPrice);

  await poPage.raiseOrder();

  await poPage.waitForSuccess();
  await expect(poPage.successToast).toBeVisible();

  api.stopCapture();
  await api.saveFiles("purchase-order");
});
