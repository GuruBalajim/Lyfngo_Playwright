import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/Inventory/InventoryPage.js';
import { AddItemModal } from '../../pages/Inventory/AddItemModal.js';
import { inventoryTestData } from '../../testdata/inventoryData.js';
import { LoginPage } from "../../pages/LoginPage.js";
import { ApiInterceptor } from "../../utils/ApiInterceptor.js";
import { credentials } from "../../testdata/credentials.js";

test('Add Inventory Item', async ({ page }, testInfo) => {

    const api = new ApiInterceptor(page, testInfo);
  

    // LOGIN
    const login = new LoginPage(page);
    await login.navigate();
    await login.login(credentials.email, credentials.password);

    // SELECT ESTABLISHMENT
    const establishmentDropdown = page.getByRole('combobox', { name: 'Establishment Name' });
    await establishmentDropdown.waitFor({ state: 'visible', timeout: 25000 });
    await establishmentDropdown.click();
    await page.getByRole('option', { name: 'Hosptial_multicare' }).click();

    const inventory = new InventoryPage(page);
    const addItem = new AddItemModal(page);

    // OPEN INVENTORY
    
    await inventory.openInventory();
  
    const newItemName = inventoryTestData.addItem.itemName;

    api.startCapture();
    // =========== ADD NEW ITEM ==========
    await inventory.addNewItemBtn.click();

    await addItem.addItem(inventoryTestData.addItem);
       api.stopCapture();
    // Refresh page because inventory list does NOT auto-update
    await page.reload();
    await page.waitForLoadState("networkidle");

    // =========== AFTER ADD → Item Should Exist ==========
    await inventory.searchBox.fill(newItemName);
await expect(inventory.getSearchResult(newItemName)).toHaveCount(1);


    // API LOGS
   
    await api.saveFiles("Inventory-Add-Item");
});
