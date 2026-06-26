const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('att jag öppnar startsidan {string}', async function (url) {
  await page.goto(url);
});

Given('att jag anger användarnamn {string}', async function (username) {
  // Byt ut '#username' mot id eller placeholder på ditt textfält
  await page.fill('#username', username);
});

Given('att jag anger e-post {string}', async function (email) {
  await page.fill('#email', email);
});

Given('att jag anger lösenord {string}', async function (password) {
  await page.fill('#password', password);
});

When('jag klickar på knappen {string}', async function (buttonText) {
  await page.click(`button:has-text("${buttonText}")`);
});

Then('ska sidan innehålla texten {string}', async function (expectedText) {
  const bodyText = await page.textContent('body');
  expect(bodyText).toContain(expectedText);
});