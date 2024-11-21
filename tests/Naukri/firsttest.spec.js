import { test, expect } from '@playwright/test'
import { LoginPage } from '../../Pages/loginpage';
import { HomePage } from '../../Pages/homepage';
import { ProfilePage } from '../../Pages/profilepage';
import { JobsPage } from '../../Pages/jobspage';

let page;
let context;
let jobTitles;
let expRanges;
let loginpage;
let homepage;
let profilepage;
let JobsPage;

//const arr = ['QA', 'Automation', 'Test', 'Selenium', 'Testing', 'Test Engineer', 'SDET', 'Test','Playwright'];
const arr = ['QA', 'Automation', 'Quality', 'Tester', 'Testing', 'Test', 'Assurance', 'QA Analyst', 'SDET', 'Selenium', 'Cypress', 'Test Engineer', 'Testers', 'Tosca', 'playwright']
const years = ['0', '1', '2', '3'];

test.beforeAll("Login to Naukri Account", async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    loginpage = new LoginPage(page);
    homepage= new HomePage(page);
    profilepage= new ProfilePage(page);
    jobspage= new JobsPage(page);

    await loginpage.navigateToNaukri("https://www.naukri.com/")

    await loginpage.naukriLogin();
    await expect(page).toHaveURL('https://www.naukri.com/mnjuser/homepage');

})

test('update resume in My Profile summary', async () => {

    await homepage.click_On_ViewProfile();
    await profilepage.deleteResume()
    await profilepage.uploadResume()
    //validate updated resume Name
    await expect(await profilepage.getResumeName()).toBe(profilepage.resumename);
})

test('update Resume Headline in My Profile Summary', async () => {
    await profilepage.updateResumeHeadLine()

});


test.skip('search and apply for Jobs', async () => {
    test.setTimeout(0);

    // Click on the Jobs menu
    await homepage.click_On_Jobs();

    // Use the locator API for tabs
    const tabCount = await JobsPage.getTabsCount()
    const tabs = await page.locator(jobspage.jobTabsList);
    

    // Loop through each tab and click
    for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i);
        await tab.click();  // Click each tab

        // Get the job titles and experience range locators after clicking a tab
        jobTitles = await page.locator('.list p');
        expRanges = await page.locator('.naukicon-ot-experience + span');

        // Get the count of job titles and iterate over them
        var jobTitleCount = await jobTitles.count();
        for (let j = 0; j < jobTitleCount; j++) {
            const title = jobTitles.nth(j);
            const titleText = await title.textContent();

            // Check if the title includes specific keywords
            if (arr.find(item => titleText.toLowerCase().includes(item.toLowerCase()))) {

                // Get the corresponding experience range
                const range = expRanges.nth(j);
                const minExp = await range.textContent();
                const minExpValue = minExp.split("-")[0].trim();

                if (years.includes(minExpValue)) {


                    // Get the number of pages (tabs) before the click
                    const pagesBeforeClick = context.pages();

                    // Click the element that opens a new tab
                    await title.click();

                    // Wait for a short time to let the new tab open (give it some time to load)
                    await page.waitForTimeout(2000); // Adjust timeout if needed

                    // Get the number of pages (tabs) after the click
                    const pagesAfterClick = context.pages();

                    // Find the new page by comparing the list of pages before and after
                    let applyPage = null;
                    for (const p of pagesAfterClick) {
                        if (!pagesBeforeClick.includes(p)) {
                            applyPage = p;
                            break;
                        }
                    }

                    if (applyPage) {
                        try {
                            if (await applyPage.locator("div[class^='styles_exp-alert-message']").isVisible()) {
                                await applyPage.close();
                                console.log("job expired")
                            } else {

                                // Wait for the new tab to fully load
                                await applyPage.waitForLoadState('domcontentloaded');

                                // Perform actions on the new tab
                                console.log('New Tab Title:', await applyPage.title());
                                console.log('New Tab URL:', applyPage.url());

                                const applyBtn = await applyPage.locator('.styles_save-job-button__WLm_s + button');
                                const applyBtnText = await applyBtn.textContent();

                                if (applyBtnText === 'Apply') {
                                    // Ensure button is visible before clicking
                                    await applyBtn.isVisible();
                                    await applyBtn.click(); // Click on the apply button
                                    await applyPage.waitForLoadState('domcontentloaded');
                                    console.log('Applied successfully');

                                    // Uncomment to validate success message visibility, ensure `page` is defined
                                    // await expect(page.locator('.apply-status-header.green')).toBeVisible();
                                }
                            }
                        } catch (error) {
                            console.error('Error applying for the job:', error);
                        } finally {
                            await applyPage.close();  // Ensure the new page is closed
                        }

                    } else {
                        console.log('No new tab detected.');
                    }

                }
            } else {
                //click on hide icon when job title not macthes with the key words 
                await page.locator('i[class*="naukicon-ot-hide"]').nth(j).click()
                //after hiding the job article, count should be reset and decrement by 1;
                jobTitleCount--;
                await page.waitForTimeout(2000)
            }
        }
    }
});

test.skip('search and apply for RECOMMENDED Jobs', async () => {
    test.setTimeout(0);

    // Click on the Jobs menu
    await homepage.click_On_Jobs();

    // Wait for the tabs to appear
    await page.waitForSelector('.tab-list .tab-wrapper div:first-child');

    // Use the locator API for tabs
    const tabs = await page.locator('.tab-list .tab-wrapper div:first-child');
    const tabCount = await tabs.count();

    // Loop through each tab and click
    for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i);
        await tab.click();  // Click each tab

        // Get the job titles and experience range locators after clicking a tab
        const jobTitles = await page.locator('.list p');
        const expRanges = await page.locator('.naukicon-ot-experience + span');

        // Get the count of job titles and iterate over them
        var jobTitleCount = await jobTitles.count();
        for (let j = 0; j < jobTitleCount; j++) {
            const title = jobTitles.nth(j);
            const titleText = await title.textContent();

            // Check if the title includes specific keywords
            if (arr.find(item => titleText.toLowerCase().includes(item.toLowerCase()))) {

                // Get the corresponding experience range
                const range = expRanges.nth(j);
                const minExp = await range.textContent();
                const minExpValue = minExp.split("-")[0].trim();

                if (years.includes(minExpValue)) {

                    // Get the number of pages (tabs) before the click
                    const pagesBeforeClick = await context.pages();

                    // Click the element that opens a new tab
                    await title.click();

                    // Wait for a short time to let the new tab open
                    await page.waitForTimeout(2000); // Adjust timeout if needed

                    // Get the number of pages (tabs) after the click
                    const pagesAfterClick = await context.pages();

                    // Find the new page by comparing the list of pages before and after
                    let applyPage = null;
                    for (const p of pagesAfterClick) {
                        if (!pagesBeforeClick.includes(p)) {
                            applyPage = p;
                            break;
                        }
                    }

                    if (applyPage) {
                        try {
                            // Wait for the page to fully load before checking for expired message
                            await applyPage.waitForLoadState('domcontentloaded'); // Ensure the page is loaded

                            // Explicitly wait for the expired error message to appear
                            const expiredMessage = await applyPage.locator("div[class^='styles_exp-alert-message']");
                            await expiredMessage.waitFor({ state: 'visible', timeout: 3000 }).catch(() => null); // Wait for visible message

                            // Now check if the expired message is visible
                            const expiredVisible = await expiredMessage.isVisible();

                            if (expiredVisible) {
                                await applyPage.close();  // Close expired page immediately
                                console.log("Job expired");
                                //hiding the expired Job 
                                await page.locator('i[class*="naukicon-ot-hide"]').nth(j).click();
                            } else {

                                // Perform actions on the new tab
                                console.log('New Tab Title:', await applyPage.title());
                                console.log('New Tab URL:', applyPage.url());

                                const applyBtn = await applyPage.locator('.styles_save-job-button__WLm_s + button');
                                const applyBtnText = await applyBtn.textContent();

                                if (applyBtnText === 'Apply') {
                                    // Ensure button is visible before clicking
                                    await applyBtn.isVisible();
                                    await applyBtn.click(); // Click on the apply button
                                    await applyPage.waitForLoadState('domcontentloaded');
                                    console.log('Applied successfully');
                                }
                            }
                        } catch (error) {
                            console.error('Error applying for the job:', error);
                        } finally {
                            // Ensure the new page is closed after actions
                            if (applyPage && !applyPage.isClosed()) {
                                await applyPage.close();
                            }
                        }
                    } else {
                        console.log('No new tab detected.');
                    }

                }
            } else {
                // Click on hide icon when job title doesn't match with the keywords
                await page.locator('i[class*="naukicon-ot-hide"]').nth(j).click();
                // After hiding the job article, count should be reset and decremented by 1
                jobTitleCount--;
                await page.waitForTimeout(2000);

            }
        }
        // jobTitles = await page.locator('.list p');
        // expRanges = await page.locator('.naukicon-ot-experience + span');
    }
});


test.afterAll("Logout from naukri Account", async () => {
    await page.locator("img.nI-gNb-icon-img").click()
    await page.getByTitle('Logout').click()
    await expect(page).toHaveURL('https://www.naukri.com/');
    await page.close();

})