describe("Top bar", () => {
  it("should hide on scroll down and appear on scroll up", () => {
    cy.visit("/")
      .scrollTo("bottom")
      .get("[data-cy=top-bar]")
      .should("not.be.visible");

    cy.scrollTo("center").get("[data-cy=top-bar]").should("be.visible");
  });
});
