// @ts-check
//QA Engineer with 2.5 years of experience in Automation and Manual Testing, specializing in API Testing and UI Automation for web platforms. Proficient in Selenium, Cypress, Postman, and Rest Assured for designing and executing effective test strategies, ensuring seamless API integrations and reliable UI functionality. Strong problem-solving skills and a proven track record of delivering high-quality software solutions.
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
