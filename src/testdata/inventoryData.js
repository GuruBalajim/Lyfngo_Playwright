export const inventoryTestData = {
  addItem: {
    category: "vitamins",
    itemName: "diclo",
    itemNumber: "INV567",
    manufacturer: "zee para",
    stockingUnit: "strip",
    reorder: 10,
    minimum: 10,
    maximum: 100,
    retailPrice: 1,
    itemType: "Drugs",
    drugType: "diclo",
    strength: 10,
    unit: "Gm"
  },

  // You can store more test datasets here
  editItem: {
    itemName: "diclo",
    rowName: "DRUGS - ₹ 1.00 - 0 Low Stock",
    newPrice: "12",
    newItemNumber: "INV569"
  },

  stockActions: {
    addStockQty: 20,
    removeStockQty: 5
  },
  deleteItem: {
  itemName: "diclo", // name shown in the table/title
  rowName: "DRUGS - ₹ 1.00 - 0 Low Stock"
}

};
