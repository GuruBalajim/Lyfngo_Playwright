// import { test, expect } from "@playwright/test";
// import { InventoryPage } from "../../pages/Inventory/InventoryPage.js";
// import { DeleteConfirmModal } from "../../pages/Inventory/DeleteConfirmModal.js";
// import { LoginPage } from "../../pages/LoginPage";
// import { ApiInterceptor } from "../../utils/ApiInterceptor";
// import { inventoryTestData } from "../../testdata/inventoryData";
// import { credentials } from "../../testdata/credentials.js";

// test("Delete an inventory item", async ({ page }, testInfo) => {
//    const api = new ApiInterceptor(page, testInfo);
     
   
//        // LOGIN
//        const login = new LoginPage(page);
//        await login.navigate();
//        await login.login(credentials.email, credentials.password);
   
//        // SELECT ESTABLISHMENT
//        const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
//        await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
//        await establishmentDropdown.click();
//        await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

//   const inventory = new InventoryPage(page);
//   const modal = new DeleteConfirmModal(page);

//   const data = inventoryTestData.deleteItem;

//   await inventory.openInventory();
//         api.startCapture();
//  await inventory.deleteItem(data.itemName);
//   await modal.confirmDelete();
//   await modal.waitForDeletedToast();

//   await expect(page.getByText("Item deleted successfully")).toBeVisible();

//   api.stopCapture();
//   await api.saveFiles("delete-item");
// });
