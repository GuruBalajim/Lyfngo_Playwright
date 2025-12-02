// import { test, expect } from "@playwright/test";
// import { InventoryPage } from "../../pages/Inventory/InventoryPage";
// import { EditItemModal } from "../../pages/Inventory/EditItemModal";
// import { LoginPage } from "../../pages/LoginPage";
// import { ApiInterceptor } from "../../utils/ApiInterceptor";
// import { inventoryTestData } from "../../testdata/inventoryData";
// import { credentials } from "../../testdata/credentials.js";

// test("Edit item", async ({ page }, testInfo) => {
//   const api = new ApiInterceptor(page, testInfo);
    
  
//       // LOGIN
//       const login = new LoginPage(page);
//       await login.navigate();
//       await login.login(credentials.email, credentials.password);
  
//       // SELECT ESTABLISHMENT
//       const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
//       await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
//       await establishmentDropdown.click();
//       await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

//   const inventory = new InventoryPage(page);
//   const modal = new EditItemModal(page);
  

//   await inventory.openInventory();
//      api.startCapture();
//      const data = inventoryTestData.editItem;
//   await inventory.openItemEdit(data.itemName, data.rowName);

//   await modal.updateItem({
//     price: data.newPrice,
//     itemNumber: data.newItemNumber
//   });

//   await expect(page.getByText("Updated Successfully")).toBeVisible();

//   api.stopCapture();
//   await api.saveFiles("edit-diclo-item");
// });
