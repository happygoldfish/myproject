const { createBdd } = require('playwright-bdd');
const { Given, When, Then } = createBdd();
const { expect } = require('@playwright/test');




Given('I enter the username {string}', async ({ page }, username) => {
  await page.getByLabel(/username/i).fill(username);
});

Given('I enter the email {string}', async ({ page }, email) => {
  await page.getByLabel(/email/i).fill(email);
});

Given('I enter the password {string}', async ({ page }, password) => {
  await page.getByLabel(/password/i).fill(password);
});

Given('att jag öppnar sidan {string}', async ({ page }, url) => {
  await page.goto(url);
});

Then('I should see the username heading {string}', async ({ page }, username) => {
  await expect(page.getByRole('heading', { name: username })).toBeVisible();
});