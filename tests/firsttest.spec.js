import { test, expect } from '@playwright/test'

let page;
test.beforeAll("Login to Naukri Account", async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("https://www.naukri.com/")

    await page.locator("#login_Layer").click();
    await page.getByPlaceholder('Enter your active Email ID / Username').fill('shanmukhbandaru9961@gmail.com')
    await page.getByPlaceholder('Enter your password').fill('Shancol@24')
    await page.locator("button[type='submit']").click();
    await expect(page).toHaveURL('https://www.naukri.com/mnjuser/homepage');

})

test('update resume in My Profile summary', async () => {

    await page.locator('.view-profile-wrapper a').click()
    const resumeVisible = await page.locator("span[data-title='delete-resume']").isVisible();

    if (resumeVisible) {
        await page.locator("span[data-title='delete-resume']").click()
        await page.locator('.lightbox.model_open.flipOpen button').click()
    }

    await page.locator('input#attachCV').setInputFiles('tests/fixtures/Shanmuka_QA_Resume_OCT2024.pdf');
    await page.locator('.resume-name-inline div').textContent();
    await expect(await page.locator('.resume-name-inline div').textContent()).toBe('Shanmuka_QA_Resume_OCT2024.pdf');
})

test('update Resume Headline in My Profile Summary', async () => {
    await page.locator('.widgetHead span:has-text("Resume headline") + span').click()
    await page.locator('.input-field.s12 textarea').clear()
    await page.locator('.input-field.s12 textarea').fill("Experienced Automation Tester | 2.5 Years | Proficient in Selenium, Java, playwright, JavaScript, Cucumber BDD, Hybrid Framework, SQL, Rest Assured, API Testing")

    await page.locator('.action.s12 button').click();

});

test.skip('Apply for Jobs', async ({ context }) => {

    // Click on the Jobs menu
    await page.locator('.nI-gNb-menus li a div:has-text("Jobs")').first().click();

    // Wait for the tabs to appear
    await page.waitForSelector('.tab-list .tab-wrapper div:first-child');

    // Use the locator API for tabs
    const tabs = await page.locator('.tab-list .tab-wrapper div:first-child');
    const tabCount = await tabs.count();
    console.log('Array size: ' + tabCount);

    // Loop through each tab and click
    for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i);
        await tab.click();  // Click each tab

        // Get the job titles and experience range locators after clicking a tab
        const jobTitles = await page.locator('.list p');
        const expRanges = await page.locator('.naukicon-ot-experience + span');

        // Get the count of job titles and iterate over them
        const jobTitleCount = await jobTitles.count();
        for (let j = 0; j < jobTitleCount; j++) {
            const title = jobTitles.nth(j);
            const titleText = await title.textContent();

            // Check if the title includes specific keywords
            if (titleText.includes("QA") || titleText.includes("Automation") || titleText.includes("Test")) {

                // Get the corresponding experience range
                const range = expRanges.nth(j);
                const minExp = await range.textContent();
                const minExpValue = minExp.split("-")[0].trim();

                if (minExpValue === "0" || minExpValue === "1" || minExpValue === "2") {

                
                    const [applyPage] = await Promise.all([
                        context.waitForEvent('page'),  // Wait for the new page to open
                        title.click(),  // Click the title element
                    ]);
                    await applyPage.waitForLoadState();
                    console.log(await applyPage.title());

                    // Find the apply button and click if applicable
                    const applyBtn = await applyPage.locator('.styles_save-job-button__WLm_s + button');
                    const applyBtnText = await applyBtn.textContent();
                    if (applyBtnText === 'Apply') {
                        await applyBtn.click();
                        await applyPage.close();  // Click on the apply button
                    } else {
                        await applyPage.close();  // Close the new page
                    }
                }
            }
        }
    }
});


test.afterAll("Logout from naukri Account", async () => {
    await page.locator("img.nI-gNb-icon-img").click()
    await page.getByTitle('Logout').click()
    await expect(page).toHaveURL('https://www.naukri.com/');
    await page.close();

})