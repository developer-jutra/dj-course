import { test, expect } from '@playwright/test';

test('Extract urgent items data', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Login if needed
  const loginButton = page.getByRole('button', { name: 'Sign In' });
  if (await loginButton.isVisible()) {
    await page.getByRole('textbox', { name: 'Email address' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('sajdkfhgsjkdf');
    await loginButton.click();
    await page.waitForURL('**/urgent', { timeout: 5000 }).catch(() => {});
  }

  // Navigate to Urgent Items
  await page.getByRole('link', { name: '🚨 Urgent' }).click();
  await page.waitForSelector('.rounded-lg.border', { timeout: 5000 });

  // Find all urgent item cards
  const cards = page.locator('.rounded-lg.border').filter({ hasText: 'Assigned to' });
  const cardCount = await cards.count();

  const urgentItems = [];

  for (let i = 0; i < cardCount; i++) {
    const card = cards.nth(i);
    
    // Extract priority (from badge)
    const priorityBadge = card.locator('[class*="bg-red-100"], [class*="bg-yellow-100"], [class*="bg-green-100"]');
    const priorityText = await priorityBadge.textContent();
    const priority = priorityText?.trim().toLowerCase() || '';

    // Extract type from icon and message
    // Icons: ⏰ (delay), 🔧 (maintenance), 💳 (payment), 👨‍💼 (driver)
    const icon = card.locator('.text-2xl').first();
    const iconText = await icon.textContent();
    let title = '';
    if (iconText?.includes('⏰')) title = 'delay';
    else if (iconText?.includes('🔧')) title = 'maintenance';
    else if (iconText?.includes('💳')) title = 'payment';
    else if (iconText?.includes('👨‍💼')) title = 'driver';
    else title = 'unknown';

    // Extract required action
    const requiredActionLabel = card.locator('text=Required Action');
    const requiredActionParent = requiredActionLabel.locator('..');
    const requiredActionText = await requiredActionParent.locator('.text-sm.font-medium').first().textContent();
    const requiredAction = requiredActionText?.trim() || '';

    // Extract assigned to
    const assignedToLabel = card.locator('text=Assigned to');
    const assignedToParent = assignedToLabel.locator('..');
    const assignedToText = await assignedToParent.locator('.text-sm.font-medium').first().textContent();
    const assignedTo = assignedToText?.trim() || '';

    urgentItems.push({
      priority,
      title,
      "required action": requiredAction,
      "assigned to": assignedTo
    });
  }

  // Output JSON array
  console.log(JSON.stringify(urgentItems, null, 2));
  
  // Also verify we got 4 items
  expect(urgentItems.length).toBe(4);
});
