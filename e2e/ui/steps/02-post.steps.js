const { createBdd } = require('playwright-bdd');
const { Given, When, Then } = createBdd();
const { expect } = require('@playwright/test');


Given('I enter the title {string}', async ({ page }, title) => {
  await page.getByLabel(/title/i).fill(title);
});

Given('I enter the body {string}', async ({ page }, body) => {
  await page.getByLabel(/body/i).fill(body);
});

Given('I enter the slug {string}', async ({ page }, slug) => {
  await page.getByLabel(/slug/i).fill(slug);
});

Given('I enter the banner {string}', async ({ page }, banner) => {
  await page.getByLabel(/banner/i).fill(banner);
});

Given('I select the author {string} from the dropdown', async ({ page }, author) => {
  await page.getByLabel(/author/i).selectOption({ label: author });
});

Then('I should see the post title heading {string}', async ({ page }, title) => {
  await expect(page.getByRole('heading', { name: title }).first()).toBeVisible();
});