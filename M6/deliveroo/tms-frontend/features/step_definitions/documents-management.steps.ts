import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given('I open the application at {string}', async function (url: string) {
  await this.page.goto(url);
});

Given('I log in to the application', async function () {
  // Fill in login form with demo credentials
  await this.page.fill('input[type="email"]', 'demo@example.com');
  await this.page.fill('input[type="password"]', 'password123');
  await this.page.getByRole('button', { name: /sign in/i }).click();
  // Wait for navigation to complete
  await this.page.waitForURL('**/dashboard');
});

When('I navigate to the {string} tab', async function (tabName: string) {
  // Click on the navigation link in sidebar
  await this.page.getByRole('link', { name: tabName }).click();
  // Wait for navigation
  await this.page.waitForURL(`**/${tabName.toLowerCase()}`);
});

When('I find document with number {string}', async function (documentNumber: string) {
  // Wait for the documents to load and find the tile containing the specified text
  // The text could be in name, number, or entity name
  this.documentTile = this.page.locator('.bg-white.rounded-lg.shadow-lg.border', {
    hasText: documentNumber
  }).first();
  await this.documentTile.waitFor();
});

When('I click the {string} button for this document', async function (buttonName: string) {
  await this.documentTile.getByRole('button', { name: new RegExp(buttonName, 'i') }).click();
});

When('I change the document name to {string}', async function (newName: string) {
  const nameInput = this.documentTile.locator('input[type="text"]');
  await nameInput.clear();
  await nameInput.fill(newName);
});

When('I click the {string} button', async function (buttonName: string) {
  await this.documentTile.getByRole('button', { name: new RegExp(buttonName, 'i') }).click();
});

Then('I should see the document name {string}', async function (expectedName: string) {
  await expect(this.documentTile.getByRole('heading', { name: expectedName })).toBeVisible();
});

Then('the {string} button should be visible', async function (buttonName: string) {
  await expect(this.documentTile.getByRole('button', { name: new RegExp(buttonName, 'i') })).toBeVisible();
});
