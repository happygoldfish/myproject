const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');

const { Given, When, Then } = createBdd();

Given('att jag öppnar startsidan {string}', async ({ page }, url) => {
  await page.goto(url);
});

Given('att jag anger användarnamn {string}', async ({ page }, username) => {
  await page.fill('#username', username);
});

Given('att jag anger e-post {string}', async ({ page }, email) => {
  await page.fill('#email', email);
});

Given('att jag anger lösenord {string}', async ({ page }, password) => {
  await page.fill('#password', password);
});

When('jag klickar på knappen {string}', async ({ page }, buttonText) => {
  await page.getByRole('button', { name: buttonText }).click();
});

Then('ska sidan innehålla texten {string}', async ({ page }, expectedText) => {
  await expect(page.locator('body')).toContainText(expectedText);
});