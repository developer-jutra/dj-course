import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given('I navigate to {string}', async function (url: string) {
  // Use page instance from the context (this.page)
  await this.page.goto(url);
});

Then('The page title should contain {string}', async function (expectedTitle: string) {
  const title = await this.page.title();
  expect(title).toContain(expectedTitle);
});
