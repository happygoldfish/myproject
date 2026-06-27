const { createBdd } = require('playwright-bdd');
const { Given, When, Then } = createBdd();
const { expect } = require('@playwright/test');

Then('the user name heading {string} should no longer be visible on the page', async ({ page }, title) => {
  await expect(page.getByRole('heading', { name: title })).toHaveCount(0);
});
