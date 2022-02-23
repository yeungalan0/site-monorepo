// describe("Auth", () => {
//   it("should redirect to sign in without a session cookie", function () {
//     cy.visit("/life-in-weeks");
//     cy.get("p").should("contain", "Please sign in to access this page");

//     cy.url().should("include", "/api/auth/signin");
//   });

//   it("should allow login with a valid session", () => {
//     // Call your custom cypress command
//     cy.login();
//     // Visit a route in order to allow cypress to actually set the cookie
//     cy.visit("/life-in-weeks");
//     // Wait until the intercepted request is ready
//     cy.wait("@session");
//     // This is where you can now add assertions
//     // Example: provide a data-test-id on an element.
//     // This can be any selector that "always and only" exists when the user is logged in
//     cy.get("[data-test-id='authenticated']")
//       .should("exist")
//       .then(() => {
//         cy.log("Cypress login successful");
//       });
//   });
// });
