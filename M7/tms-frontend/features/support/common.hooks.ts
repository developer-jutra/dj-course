import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext, Page } from "@playwright/test";

let browser: Browser;
let context: BrowserContext;
let page: Page;

setDefaultTimeout(60 * 1000);

BeforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

Before(async function () {
  context = await browser.newContext();
  page = await context.newPage();
  this.page = page; // Expose page to world/steps
});

After(async function () {
  await this.page?.close();
  await context?.close();
});

AfterAll(async () => {
  await browser.close();
});

export { page };
