const { createBdd } = require('playwright-bdd');
const { Given, When, Then } = createBdd();
const { expect } = require('@playwright/test');

Given('I open the homepage {string}', async ({ page }, url) => {
  await page.goto(url);
});

Given('I open the user page {string}', async ({ page }, arg) => {
  await page.goto(arg);
});

Given('I open the post page {string}', async ({ page }, url) => {
  await page.goto(url);
});

When('I click the button {string}', async ({ page }, buttonText) => {
  const btn = page.getByRole('button', { name: buttonText });
  await expect(btn.first()).toBeVisible({ timeout: 15000 });
  await btn.first().click();
});

Then('I should see the text {string}', async ({ page }, text) => {
  await expect(page.getByText(text)).toBeVisible();
});

