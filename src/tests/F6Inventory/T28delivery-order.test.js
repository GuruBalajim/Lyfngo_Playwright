import { test, expect } from "@playwright/test";
import { PurchaseOrderPage } from "../../pages/Inventory/PurchaseOrderPage.js";
import { DeliveryOrderPage } from "../../pages/Inventory/DeliveryOrderPage.js";
import { InventoryPage } from "../../pages/Inventory/InventoryPage.js";
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";
import { deliveryOrderData } from "../../testdata/delivery-order-data.js";

test("Create Delivery Order for a Purchase Order", async ({ page }, testInfo) => {
  const api = new ApiInterceptor(page, testInfo);
  api.startCapture();
 
 const login = new LoginPage(page);
      await login.navigate();
      await login.login(credentials.email, credentials.password);
  
      // SELECT ESTABLISHMENT
      const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
      await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
      await establishmentDropdown.click();
      await page.getByRole('option', { name: 'Hosptial_multicare' }).click();
  const poPage = new PurchaseOrderPage(page);
  const doPage = new DeliveryOrderPage(page);
   const inventory = new InventoryPage(page);
  const data = deliveryOrderData;
 await inventory.openInventory();
 api.startCapture();
 await poPage.openPurchaseOrderTab();
  // 1. Open DO for specific PO
  await doPage.openDeliveryOrder(data.poNumber);

  // 2. Fill batch + expiry
  await doPage.fillBatch(data.batch);
  await doPage.selectExpiry(data.expiryMonth, data.expiryYear);

  // 3. Update Delivery
  await doPage.updateDelivery();

  // 4. Navigate to Delivered tab
  await doPage.goToDeliveredTab();

  // 5. Open Status from delivered table
  await doPage.openStatus(data.poNumber);

  api.stopCapture();
  await api.saveFiles("delivery-order");
});
