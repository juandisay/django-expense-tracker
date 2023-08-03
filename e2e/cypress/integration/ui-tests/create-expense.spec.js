/// <reference types="cypress" />

const { Expense } = require("../../support/utils");
const fieldsToEmpty = ["amount", "content", "category", "source", "date"];

const expenseData = require("../../fixtures/expense.json");

describe("Create expense Tests", () => {
  const ctx = {};

  beforeEach(() => {
    cy.loginAndCleanUp(ctx);
    const expense = new Expense(expenseData);
    ctx.expense = expense;

    cy.visit("/");
    cy.get("[data-test=create-expense]").click();
    cy.url().then((url) => {
      ctx.createExpensePageUrl = url;
    });
  });

  it("should create an expense", function () {
    cy.createExpenseWithUI(ctx.expense);

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("#expense-table > table > tbody > tr:nth-child(1)")
      .should("be.visible")
      .and("contain", `€ ${ctx.expense.amount}`)
      .and("contain", ctx.expense.content)
      .and("contain", ctx.expense.category)
      .and("contain", ctx.expense.source)
      .and("contain", ctx.expense.date);
  });

  it("should NOT allow to create an expense while leaving 'amount' field at 0", function () {
    ctx.expense.amount = 0;
    cy.createExpenseWithUI(ctx.expense);

    cy.url().should("eq", ctx.createExpensePageUrl);
    cy.get("[data-test=container]")
      .should("be.visible")
      .and("contain", "Ensure this value is greater than or equal to 0.01.");
  });

  fieldsToEmpty.forEach((fieldToEmpty) => {
    it(`should NOT allow to create an expense while leaving ${fieldToEmpty} field empty`, function () {
      cy.createExpenseWithUI(ctx.expense, false);

      if (fieldToEmpty == "category")
        cy.get(`[data-test=expense-input-${fieldToEmpty}]`).select("---------");
      else cy.get(`[data-test=expense-input-${fieldToEmpty}]`).clear();
      cy.get("[data-test=create-expense-save]").click();

      cy.url().should("eq", ctx.createExpensePageUrl);
      cy.get("[data-test=create-expense-form]").should("be.visible");
    });
  });

  it("should NOT allow to create an expense with amount bigger than 9,999,999,999", function () {
    ctx.expense.amount = 10000000000;
    cy.createExpenseWithUI(ctx.expense);

    cy.url().should("eq", ctx.createExpensePageUrl);
    cy.get("[data-test=container]")
      .should("be.visible")
      .and(
        "contain",
        "Ensure that expense amount is not bigger than 9,999,999,999."
      );
  });

  it("should NOT allow to create an expense with an incorrect format date", function () {
    ctx.expense.date = "20201210 1200pm";
    cy.createExpenseWithUI(ctx.expense);

    cy.url().should("eq", ctx.createExpensePageUrl);
    cy.get("[data-test=container]")
      .should("be.visible")
      .and("contain", "Enter a valid date/time.");
  });
});
