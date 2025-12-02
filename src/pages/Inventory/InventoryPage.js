export class InventoryPage {
    constructor(page) {
        this.page = page;

        this.inventoryMenu = page.getByRole("link", { name: /Inventory/i });
        this.addNewItemBtn = page.getByRole("button", { name: /Add New item/i });

        // Table rows
        this.itemRows = page.locator('tbody tr');  

        // Search box (your real locator from CodeGen)
        this.searchBox = page.getByRole('textbox', { name: 'Search drugs, supplies,' });
        this.itemTitle = (name) => page.getByTitle(name, { exact: true });



    this.editButton = (rowName) =>
      page.getByRole("row", { name: rowName }).getByLabel("Edit");
    }

    async openInventory() {
        await this.inventoryMenu.click();
        await this.page.waitForLoadState("networkidle"); 
    }

    async getItemCount() {
        return await this.itemRows.count();
    }

    // Search Result Row by item title (unique!)
    getSearchResult(itemName) {
        return this.page.getByTitle(itemName, { exact: true });
    }
      async openItemEdit(itemName, rowName) {
    await this.itemTitle(itemName).click();
    await this.editButton(rowName).click();
  }
// inside InventoryPage class

// Helper to get the row locator for a given itemName (tries precise options)
async getRowByItemName(itemName) {
  // 1) Prefer the exact title-based cell (most reliable for your DOM)
  const rowByTitle = this.page
    .locator('.MuiDataGrid-row')
    .filter({ has: this.page.getByTitle(itemName, { exact: true }) });

  if (await rowByTitle.count() > 0) return rowByTitle.first();

  // 2) Fallback: find a cell with data-field="itemName" that has title attribute equal to itemName
  const cellByTitle = this.page.locator(`.MuiDataGrid-cell[data-field="itemName"] [title="${itemName}"]`);
  if (await cellByTitle.count() > 0) {
    // go to ancestor row
    const ancestorRow = cellByTitle.locator('xpath=ancestor::div[contains(@class,"MuiDataGrid-row")]');
    if (await ancestorRow.count() > 0) return ancestorRow.first();
  }

  // 3) Fallback: narrow getByText exact inside tbody (if table-based)
  const tableText = this.page.locator('tbody').getByText(itemName, { exact: true });
  if (await tableText.count() > 0) {
    const trAncestor = tableText.locator('xpath=ancestor::tr');
    if (await trAncestor.count() > 0) return trAncestor.first();
  }

  // nothing found
  return null;
}

async deleteItem(itemName) {
  // Find the row using the helper
  const row = await this.getRowByItemName(itemName);

  if (!row) {
    throw new Error(`deleteItem: could not find row for itemName="${itemName}".`);
  }

  // Ensure row is visible vertically
  await row.scrollIntoViewIfNeeded();

  // Scroll horizontally to reveal action column (Delete button)
  await this.page.locator('.MuiDataGrid-virtualScroller')
    .evaluate(el => { el.scrollLeft = el.scrollWidth; });

  // Now find the Delete button inside that row and click it
  const deleteBtn = row.getByRole('button', { name: 'Delete' });

  // Wait a short while for visibility (smaller timeout because we already scrolled)

  await deleteBtn.click();
}


}
