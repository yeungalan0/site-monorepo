describe("My site", () => {
  before(() => {
    cy.visit("/")
      .get("[data-cy=blog-posts]")
      .its("length")
      .should("gt", 0)
      .as("postsListLength");
  });
  it("should have working basic navigation", function () {
    cy.visit("/");
    cy.location("pathname").should("eq", "/blog");

    cy.get("[data-cy=topbar-about]").contains("About").click();
    cy.location("pathname").should("eq", "/about");

    cy.get("[data-cy=topbar-projects]").contains("Projects").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/blog");
      expect(loc.search).to.eq("?tags=projects");
    });
    cy.get("[data-cy=blog-posts]")
      .its("length")
      .should((length) => {
        expect(length).within(1, this.postsListLength);
      });

    cy.get("[data-cy=topbar-blog]").contains("Blog").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/blog");
      expect(loc.search).to.eq("");
    });
    cy.get("[data-cy=blog-posts]")
      .its("length")
      .should("eq", this.postsListLength);
  });
});
