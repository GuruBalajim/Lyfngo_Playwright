export class DeleteConfirmModal {
  constructor(page) {
    this.page = page;

    this.yesBtn = page.getByRole("button", { name: "Yes" });
    this.toast = page.getByText("Item deleted successfully");
  }

  async confirmDelete() {
    await this.yesBtn.click();
  }

  async waitForDeletedToast() {
    await this.toast.waitFor({ state: "visible" });
  }
}
