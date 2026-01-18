import { test, expect, Page } from '@playwright/test';

// Helper object to locate and interact with urgent items
const UrgentItemLocator = {
  getUrgentItemByAssignedTo: (page: Page, name: string) => {
    // Find the card that contains both "Assigned to" text and the specific assignee name
    // The card structure: contains "Assigned to" label followed by the assignee name
    const card = page.locator('.rounded-lg.border')
      .filter({ hasText: 'Assigned to' })
      .filter({ hasText: name })
      .first();

    return {
      card,
      textIsVisible: async (text: string): Promise<void> => {
        await expect(card.getByText(text)).toBeVisible();
      }
    };
  }
};

const dataset = [
  {
    "priority": "high",
    "title": "delay",
    "requiredAction": "Contact customer",
    "assignedTo": "Mike Johnson"
  },
  {
    "priority": "medium",
    "title": "maintenance",
    "requiredAction": "Schedule service",
    "assignedTo": "Sarah Lee"
  },
  {
    "priority": "high",
    "title": "payment",
    "requiredAction": "Follow up with client",
    "assignedTo": "David Chen"
  },
  // {
  //   "priority": "low",
  //   "title": "driver",
  //   "requiredAction": "Renewal reminder",
  //   "assignedTo": "Mike Johnson"
  // }
]

test.describe('Urgent Items', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('sajdkfhgsjkdf');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.getByRole('link', { name: '🚨 Urgent' }).click();
  });

  test('should display all urgent items with correct information', async ({ page }) => {
    for (const item of dataset) {
      const urgentItem = UrgentItemLocator.getUrgentItemByAssignedTo(page, item.assignedTo);
      await urgentItem.textIsVisible(item.priority);
      await urgentItem.textIsVisible(item.title);
      await urgentItem.textIsVisible(item.requiredAction);
    }
  });

  test('should reassign urgent item to another employee', async ({ page }) => {
    const urgentItem = UrgentItemLocator.getUrgentItemByAssignedTo(page, 'Mike Johnson');
    
    await urgentItem.card.getByRole('button', { name: 'Reassign' }).click();
    await page.getByRole('combobox', { name: 'Reassign To:' }).click();
    await page.getByText('Lisa Park').click();
    await page.getByRole('button', { name: 'Reassign' }).click();
  });
});