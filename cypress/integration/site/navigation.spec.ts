describe("My site", () => {
  before(() => {
    cy.visit("/blog")
      .get("[data-cy=blog-posts]")
      .its("length")
      .should("gt", 0)
      .as("postsListLength");
  });
  it("should have working basic navigation", function () {
    // navigation to home should redirect to blog
    cy.visit("/");
    cy.location("pathname").should("eq", "/blog");

    // navigation to about should go to about
    cy.get("[data-cy=top-bar-about]").contains("About").click();
    cy.location("pathname").should("eq", "/about");

    // navigation to projects should go to blog with filtered projects
    cy.get("[data-cy=top-bar-projects]").contains("Projects").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/blog");
      expect(loc.search).to.eq("?tags=projects");
    });
    cy.get("[data-cy=blog-posts]")
      .its("length")
      .should((length) => {
        expect(length).within(1, this.postsListLength);
      });
    cy.get("[data-cy=blog-tags-filter-input]").should("have.value", "projects");

    // navigation back to blog should bring back original number of posts
    cy.get("[data-cy=top-bar-blog]").contains("Blog").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/blog");
      expect(loc.search).to.eq("");
    });
    cy.get("[data-cy=blog-posts]")
      .its("length")
      .should("eq", this.postsListLength);
    cy.get("[data-cy=blog-tags-filter-input]").should("have.value", "");
  });
});
