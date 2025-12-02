import { test, expect } from "@playwright/test";
import { LeadsPage } from "../../pages/LeadsPage";
import { AppointmentPage } from "../../pages/AppointmentPage.js";
import { LoginPage } from "../../pages/LoginPage";
import { leadsTestData } from "../../testdata/leads-test-data.js";
import { credentials } from "../../testdata/credentials";

test("Convert Lead into Patient and Create Appointment", async ({ page }) => {

  const login = new LoginPage(page);
  await login.navigate();
  await login.login(credentials.email, credentials.password);

  const leads = new LeadsPage(page);

  await leads.gotoLeads();
  await leads.openAddLead();
  await leads.fillLeadForm(leadsTestData.validLead);
  await leads.saveLead();

  await leads.openLeadFromList(
    leadsTestData.validLead.name,
    leadsTestData.validLead.mobile
  );

  await leads.convertLeadToCustomer();


  // ✅ Appointment Flow
  const appointment = new AppointmentPage(page);

await appointment.createAppointment({
  patientName: leadsTestData.validLead.name,
  dateCell: "Nov 24,",
  time: "11:00 AM",
  duration: "25 mins"
});


  await appointment.verifyAppointmentSuccess();
});
