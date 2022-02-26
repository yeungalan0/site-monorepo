beforeEach(() => {
  cy.task("db:reset");
});

describe("life-in-weeks", () => {
  it("should redirect to sign in without a session cookie", () => {
    cy.visit("/life-in-weeks");
    cy.get("p").should("contain", "Please sign in to access this page");

    cy.url().should("include", "/api/auth/signin");
  });

  it("should display birthdate form given a valid session without a birthdate", () => {
    const session = "liw-user-no-bdate.json";
    cy.task("db:seed", session);
    cy.login(session);
    cy.visit("/life-in-weeks");

    cy.get("[data-cy=birthdate-form-text-field]")
      .should("exist")
      .then(() => {
        cy.log("Cypress login successful");
      })
      .type("08/24/") // May fail if testing a mobile view since datepicker does not allow typing on mobile
      .get("[data-cy=birthdate-form-submit]")
      .should("be.disabled")
      .get("[data-cy=birthdate-form-text-field]")
      .type("1994")
      .get("[data-cy=birthdate-form-submit]")
      .should("be.enabled")
      .click();
  });
});
