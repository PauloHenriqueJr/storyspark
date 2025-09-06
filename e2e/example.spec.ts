import { test, expect } from '@playwright/test';

test('homepage renders header brand', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /StorySpark/i })).toBeVisible();
});

