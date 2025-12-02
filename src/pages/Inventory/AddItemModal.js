export class AddItemModal {
    constructor(page) {
        this.page = page;
    }

    async addItem({
            category,
        itemName,
        itemNumber,
        manufacturer,
        stockingUnit,
        reorder,
        minimum,
        maximum,
        retailPrice,
        itemType,
        drugType,
        strength,
        unit
    }) {

        // Category
        await this.page.getByRole('combobox', { name: 'Category name*' }).click();
        await this.page.getByRole('option', { name: category }).click();

        // Item Name - Add New
        await this.page.getByRole('combobox', { name: 'Item name *' }).click();
        await this.page.getByRole('combobox', { name: 'Item name *' }).fill(itemName);
        await this.page.getByRole('option', { name: `Add "${itemName}"` }).click();

        // Item Number
        await this.page.getByRole('textbox', { name: 'Item number *' }).fill(itemNumber);

        // Manufacturer
        await this.page.getByRole('combobox', { name: 'Manufacturer *' }).click();
        await this.page.getByRole('option', { name: manufacturer }).click();

        // Stocking Unit
        await this.page.getByRole('combobox', { name: 'Stocking unit *' }).click();
        await this.page.getByRole('option', { name: stockingUnit }).click();

        // Re-order level / Min / Max
      await this.page.getByRole('spinbutton', { name: 'Re-order level' }).fill(String(reorder));
    await this.page.getByRole('spinbutton', { name: 'Minimum' }).fill(String(minimum));
    await this.page.getByRole('spinbutton', { name: 'Maximum' }).fill(String(maximum));
        // Retail Price
        await this.page.getByRole('spinbutton', { name: 'Retail price *' }).fill(String(retailPrice));

        // Item Type
        await this.page.getByRole('combobox', { name: 'Item type *' }).click();
        await this.page.getByRole('option', { name: itemType }).click();

        // Drug Type - Add new
        await this.page.getByRole('combobox', { name: 'Drug type *' }).click();
        await this.page.getByRole('combobox', { name: 'Drug type *' }).fill(drugType);
        await this.page.getByRole('option', { name: `Add "${drugType}"` }).click();

        // Strength
        await this.page.getByRole('textbox', { name: 'Strength *' }).fill(String(strength));

        // Unit
        await this.page.getByRole('combobox', { name: 'Select unit *' }).click();
        await this.page.getByRole('option', { name: unit }).click();

        // SAVE
        await this.page.getByRole('button', { name: 'Save' }).click();
// Exact toast text from your codegen
const toast = this.page.getByText('Item added successfully');

// Wait for toast to appear
await toast.waitFor({ timeout: 10000 });

// Click toast to close it (as LYFNGO requires)
await toast.click();
    }
}
