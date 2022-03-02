import { addWeeks, addYears, subDays } from "date-fns";
import {
  AVERAGE_LIFE_EXPECTANCY_MALE,
  WEEKS_PER_YEAR,
} from "../../../src/life-in-weeks/definitions";

beforeEach(() => {
  cy.task("db:reset");
});

describe("life-in-weeks", () => {
  const endpoint = "/life-in-weeks";
  const user = {
    name: "Morty Smith",
    email: "test@picklerick.com",
    image: "/path/to/butterbot.jpg",
    birthdate: "12/02/13",
  };
  const mortyBirthdate = new Date(user.birthdate);

  it("should redirect to sign in without a session cookie", () => {
    cy.visit(endpoint);
    cy.get("p").should("contain", "Please sign in to access this page");

    cy.url().should("include", "/api/auth/signin");
  });

  it("should display birthdate form given a valid session without a birthdate and submission should work", () => {
    const userNoBirthdate = {
      name: user.name,
      email: user.email,
      image: user.image,
    };

    cy.task("db:seed", userNoBirthdate);
    cy.login(userNoBirthdate);
    cy.visit(endpoint);

    cy.get("[data-cy=birthdate-form-text-field]")
      .as("formTextField")
      .should("exist")
      .then(() => {
        cy.log("Cypress login successful");
      })
      .type("08/24/") // May fail if testing a mobile view since datepicker does not allow typing on mobile
      .get("[data-cy=birthdate-form-submit]")
      .as("formSubmit")
      .should("be.disabled")
      .get("@formTextField")
      .type("1994")
      .get("@formSubmit")
      .should("be.enabled")
      .click();

    cy.get("[data-cy=liw-table]", { timeout: 10000 }).should("be.visible");
  });

  it("should have proper checked/disabled boxes near end of birth year", () => {
    const now = addYears(mortyBirthdate, 1);
    const expectedRows = Math.floor(AVERAGE_LIFE_EXPECTANCY_MALE) + 1;
    const expectedCols = WEEKS_PER_YEAR + 1;

    // Target date object specifically for this loading bug:
    // https://github.com/cypress-io/cypress/issues/7455
    cy.clock(now, ["Date"]);
    cy.login(user);
    cy.visit(endpoint);

    cy.get("[data-cy=liw-table]", { timeout: 10000 })
      .should("be.visible")
      .get("tbody tr")
      .as("rows")
      .should("have.length", expectedRows)
      .eq(0) // Get first row
      .children() // Get columns
      .should("have.length", expectedCols)
      .get("@rows")
      .eq(expectedRows - 1)
      .children()
      .should("have.length.lessThan", expectedCols); // Last row of life should end abruptly

    // Before birthday is checked and not clickable
    const weekBeforeNow = subDays(now, 8); // last box isn't exactly 1 week away
    cy.get(`[data-tip='${weekBeforeNow.toLocaleDateString("en-US")}']`)
      .should("be.checked")
      .click({ force: true })
      .should("be.checked");

    // This week is clickable
    cy.get(`[data-tip='${now.toLocaleDateString("en-US")}']`)
      .should("not.be.checked")
      .click()
      .should("be.checked");

    // After birthday is not checked and not clickable
    const weekAfterNow = addWeeks(now, 1);
    cy.get(`[data-tip='${weekAfterNow.toLocaleDateString("en-US")}']`)
      .should("not.be.checked")
      .click({ force: true })
      .should("not.be.checked");
  });

  it("should have proper checked boxes during last day of life", () => {
    const lastYearOfLife = addYears(
      mortyBirthdate,
      AVERAGE_LIFE_EXPECTANCY_MALE
    );
    const remainingWeeksTillLast = 15;
    const now = addWeeks(lastYearOfLife, remainingWeeksTillLast);

    cy.clock(now, ["Date"]);
    cy.login(user);
    cy.visit(endpoint);

    cy.get(`[data-tip='${now.toLocaleDateString("en-US")}']`)
      .should("not.be.checked")
      .click()
      .should("be.checked");
  });

  // Note: Due to a weird bug (possibly with cy.tick()) I had to separate this test out into it's own
  it("should all be checked after average lifespan", () => {
    const lastYearOfLife = addYears(
      mortyBirthdate,
      AVERAGE_LIFE_EXPECTANCY_MALE
    );
    const remainingWeeksTillLast = 15;
    const lastWeekOfLife = addWeeks(lastYearOfLife, remainingWeeksTillLast);
    const now = addWeeks(lastWeekOfLife, 1); // Make now after the average last week of life

    cy.clock(now, ["Date"]);
    cy.login(user);
    cy.visit(endpoint);

    cy.get(`[data-tip='${lastWeekOfLife.toLocaleDateString("en-US")}']`)
      .should("be.checked")
      .click({ force: true })
      .should("be.checked");
  });
});
