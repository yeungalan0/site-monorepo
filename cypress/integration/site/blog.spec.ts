describe("Blog", () => {
  before(() => {
    cy.visit("/blog")
      .get("[data-cy=blog-posts]")
      .its("length")
      .should("gt", 0)
      .as("postsListLength");
  });

  it("should have working filtering", function () {
    // test filtering with one box works
    cy.visit("/blog").get("[data-cy=blog-tags-filter]").click();
    cy.get("[data-cy=blog-tags-filter-box-projects]").click();
    cy.get("[data-cy=blog-posts]")
      .its("length")
      .should("lt", this.postsListLength);

    // test filtering with two boxes works
    cy.get("[data-cy=blog-tags-filter-box-values]").click();
    cy.get("[data-cy=blog-posts]").should("not.exist");

    // test un-checking boxes returns us to the original state
    cy.get("[data-cy=blog-tags-filter-box-projects]").click();
    cy.get("[data-cy=blog-tags-filter-box-values]").click();
    cy.get("[data-cy=blog-posts]")
      .its("length")
      .should("eq", this.postsListLength);
  });
});
