/// <reference types="cypress" />

describe("Budget API Tests", () => {
  const apiUrl = "http://localhost:8000/api";
  let accessToken = null;

  // Login and store the access token for further requests
  before(() => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/login/`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "testuser1",
        password: "testpass1",
      }),
    }).then((res) => {
      accessToken = res.body.access;
    });
  });

  beforeEach(() => {
    // Delete budget if exists
    cy.request({
      method: "GET",
      url: `${apiUrl}/budget/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      console.log(res);
      const budget = res.body;

      if (budget && budget.amount) {
        cy.request({
          method: "DELETE",
          url: `${apiUrl}/budget/delete/${budget.id}/`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }).then((res) => {
          console.log(res);
          expect(res.status).to.eq(204);
        });
      }
    });
  });

  it("GET - /api/budget/ - should retrieve all existing expenses", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/budget/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      expect(typeof res.body === "object").to.be.true;
      expect(res.status).to.eq(200);
    });
  });

  it("POST - /api/budget/create/ - should create a new budget", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/budget/create/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        amount: 30,
      },
    }).then((res) => {
      expect(res.status).to.eq(201);

      const newBudget = res.body;
      expect(newBudget).to.have.property("amount", parseFloat(30).toFixed(2));
    });
  });

  it("PUT - /api/budget/update/ - should update an existing budget", () => {
    // First create a budget, store  it's id and then use that id to update the correct expense
    cy.request({
      method: "POST",
      url: `${apiUrl}/budget/create/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        amount: 30,
      },
    }).then((res) => {
      const newBudget = res.body;
      console.log(newBudget);

      cy.request({
        method: "PUT",
        url: `${apiUrl}/budget/update/${newBudget.id}/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          amount: 60,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);

        const updatedBudget = res.body;
        expect(updatedBudget).to.have.property(
          "amount",
          parseFloat(60).toFixed(2)
        );
      });
    });
  });
  it("DELETE - /api/budget/delete/ - should delete an existing budget", () => {
    // First create a budget, store  it's id and then use that id to update the correct expense
    cy.request({
      method: "POST",
      url: `${apiUrl}/budget/create/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        amount: 30,
      },
    }).then((res) => {
      const newBudget = res.body;

      cy.request({
        method: "DELETE",
        url: `${apiUrl}/budget/delete/${newBudget.id}/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        console.log(res);
        expect(res.status).to.eq(204);
      });
    });
  });
});
