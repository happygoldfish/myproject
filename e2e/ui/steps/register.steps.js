const { Given, When, Then } = require('playwright-bdd');
const { expect } = require('@playwright/test');

// Lägg till { page } som destrukturerat argument i varje funktion
Given('att jag öppnar startsidan {string}', async function ({ page }, url) {
  await page.goto(url);
});

Given('att jag anger användarnamn {string}', async function ({ page }, username) {
  await page.fill('#username', username);
});

Given('att jag anger e-post {string}', async function ({ page }, email) {
  await page.fill('#email', email);
});

Given('att jag anger lösenord {string}', async function ({ page }, password) {
  await page.fill('#password', password);
});

When('jag klickar på knappen {string}', async function ({ page }, buttonText) {
  await page.click(`button:has-text("${buttonText}")`);
});

Then('ska sidan innehålla texten {string}', async function ({ page }, expectedText) {
  // Bättre Playwright-praxis: Använd locator och toHaveText för automatisk väntan (retry)
  await expect(page.locator('body')).toContainText(expectedText);
});
