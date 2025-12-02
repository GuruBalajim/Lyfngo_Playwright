export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.getByRole('textbox', { name: 'Email id *' });
    this.passwordField = page.getByRole('textbox', { name: 'Enter Password *' });
    this.loginButton = page.getByRole('button', { name: 'Submit' });
  }

  async navigate() {
  try {
    await this.page.goto("https://flash.lyf.yoga/", {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  } catch {
    console.log("Retrying site load...");
    await this.page.waitForTimeout(3000);
    await this.page.goto("https://flash.lyf.yoga/", { waitUntil: 'domcontentloaded' });
  }
  }
  async login(email, password) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}

