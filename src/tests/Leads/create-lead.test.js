import { test, expect } from "@playwright/test";
import { LeadsPage } from "../../pages/LeadsPage.js";
import { leadsTestData } from "../../testdata/leads-test-data.js";
import { LoginPage } from "../../pages/LoginPage";

// Import test data (JS)
import { credentials } from "../../testdata/credentials";

test("Create Lead (Valid Flow)", async ({ page }) => {

     // Login
      const login = new LoginPage(page);
      await login.navigate();
      await login.login(credentials.email, credentials.password);

  
      const leads = new LeadsPage(page);

  await page.goto("https://flash.lyf.yoga/leads");

//   await leads.gotoLeads();
  await leads.openAddLead();

  await leads.fillLeadForm(leadsTestData.validLead);

  await leads.saveLead();

  // Verification (optional if table updates)
  await expect(page.getByText(leadsTestData.validLead.name)).toBeVisible();
});
