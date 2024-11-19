import { test, expect } from '@playwright/test'

let page;
let context;
const arr = ['QA', 'Automation', 'Quality', 'Tester', 'Testing', 'Test', 'Assurance', 'QA Analyst', 'SDET', 'Selenium', 'Cypress', 'Test Engineer', 'Testers', 'Tosca', 'playwright']

const isdisabled = async (element) => {
     return await element.isDisabled()
  };
  

test.beforeAll("Login to Naukri Account", async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto("https://www.naukri.com/nlogin/login")

    //await page.locator("#login_Layer").click();
    await page.locator('#usernameField').fill('shanmukhbandaru9961@gmail.com')
    await page.locator('#passwordField').fill('Shancol@24')
    await page.locator("button[type='submit']").first().click();
    await expect(page).toHaveURL('https://www.naukri.com/mnjuser/homepage');

})


test('search for Jobs', async () => {

    test.setTimeout(0);

    //searching jobs
    await page.locator('.nI-gNb-search-bar button').click()
    await page.getByPlaceholder("Enter keyword / designation / companies").type("QA,Automation,Testing,selenium");
    await page.locator('#experienceDD').click();
    await page.getByRole('listitem', { name: '2 years', exact: true }).click()

    await page.getByPlaceholder('Enter location').fill("Hyderabad");
    await page.locator('button.nI-gNb-sb__icon-wrapper').click();

    await page.waitForLoadState();

    await page.locator('#filter-freshness').click()
    await page.locator('#filter-freshness+ul li[title="Last 7 days"]').click().then(() => {
        console.log("freshness updated to last 7 days")
    })



    //selecting departments filter
    await page.waitForSelector("#functionAreaIdGid", { state: 'attached' });
    const dep_viewMore = await page.locator("#functionAreaIdGid");
    //await dep_viewMore.scrollIntoViewIfNeeded();
    await page.evaluate(() => {
        window.scrollBy(0, 100);
    });
    await dep_viewMore.click();


    const departments = page.locator('div[class*="swiper-slide"] label[for*="QA"], div[class*="swiper-slide"] label[for*="Quality"]');
    await departments.first().waitFor({ state: 'visible' })
    
    const count = await departments.count();

    for (let i = 0; i < count; i++) {
        await departments.nth(i).click();
    }
    await page.locator(".swiper-scrollbar+div").click();

    const next_btn = await page.locator('#lastCompMark div[align="center"] ~ a');

    let isFirstIteration = true; // Flag to track the first iteration

    do {
        console.log(await next_btn.isEnabled())
        await next_btn.waitFor({state:"visible"})
        console.log(await next_btn.isEnabled())
        if (!isFirstIteration) {
            // Click the "next page" button only from the second iteration onward
            await next_btn.click();
           
            await page.waitForTimeout(1000); // Adjust timeout if needed
        }

        // Wait for all titles to load on the page
        await page.waitForSelector('a.title');
        const titles = await page.locator('a.title');

        // Get the count of titles to loop through
        const titleCount = await titles.count();

        console.log(titleCount);

        // Loop through each title sequentially
        for (let i = 0; i < titleCount; i++) {
            const title = titles.nth(i);  // Select the title by index
            const titleText = await title.textContent();

            if (arr.find(item => titleText.toLowerCase().includes(item.toLowerCase()))) {
                // Get the URL from the 'href' attribute of the title
                const url = await title.getAttribute('href');
                const page1 = await context.newPage();

                // Navigate to the job detail page
                await page1.goto(url);

                // Locate the apply button (assumes it's the button next to the save-job button)
                const apply_btn = await page1.locator("button[class^='styles_save-job-button'] + button");

                // Get the 'id' attribute of the apply button
                const id = await apply_btn.getAttribute('id');

                // Check if the button is the 'apply' button by 'id'
                if (id === 'apply-button') {
                    try {
                        // Try clicking the apply button
                        await apply_btn.click();
                        await page1.waitForLoadState('domcontentloaded');
                        
                        // // Fallback: Close chatBot if it appears and click on 'Save Job'
                        // try {
                        //     const el = await page.locator("div[class^='crossIcon chatBot ']");

                        //     // Check if the chatBot element is visible before clicking
                        //     if (await el.isVisible()) {
                        //         await el.click();
                        //         console.log("ChatBot closed successfully.");
                        //     }

                        //     // Attempt to save the job after closing the chatbot
                        //     await page.locator("button[class*='save-job-button']").click();
                        //     console.log("Job saved successfully...");
                        // } catch (fallbackError) {
                        //     console.log("Error in fallback action: ", fallbackError);
                        // } finally {
                        //     // Always close the page after either action
                        //     await page1.close();
                        // }
                        await page.waitForTimeout(7000);
                        await page1.close();
                    } catch (error) {

                        console.log("Error while applying for job: ", error);

                    }
                } else {
                    console.log('Button has id: ' + id);
                    await page1.close();
                }

            }
        }

        isFirstIteration = false; // Update flag after the first iteration
    } while (await isdisabled(next_btn)==false);

})

test.afterAll("Logout from naukri Account", async () => {
    await page.locator("img.nI-gNb-icon-img").click()
    await page.getByTitle('Logout').click()
    await expect(page).toHaveURL('https://www.naukri.com/');
    await page.close();

})