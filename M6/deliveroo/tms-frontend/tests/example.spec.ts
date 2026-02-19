import { test, expect } from '@playwright/test';

test.skip('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TMS/i);
});

test.skip('get started link', async ({ page }) => {
  await page.goto('/');

  // Find an element with the text "Get started" and click on it
  // await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading.
  // await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
