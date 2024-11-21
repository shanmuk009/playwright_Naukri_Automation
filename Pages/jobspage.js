class JobsPage {
    constructor(page) {
        this.page = page; // Ensure `page` is accessible in the class
        this.jobTabsList = ".tab-list .tab-wrapper div:first-child";
        this.jobTileElements = ".list p";
        this.expRangeElements = ".naukicon-ot-experience + span";
        this.jobApplyBtn = '.styles_save-job-button__WLm_s + button';

        this.keywords = [
            'QA', 'Automation', 'Quality', 'Tester', 'Testing', 'Test', 
            'Assurance', 'QA Analyst', 'SDET', 'Selenium', 'Cypress', 
            'Test Engineer', 'Testers', 'Tosca', 'Playwright'
        ];
        this.years = ['0', '1', '2', '3'];
    }

    // Method 1: Check if a job matches the criteria
    async isJobMatched(jobTitles, expRanges, jobKeywords, years) {
        let keywordMatch = false;
        let minExpMatch = false;

        const jobTitleCount = await jobTitles.count();
        for (let j = 0; j < jobTitleCount; j++) {
            const title = jobTitles.nth(j);
            const titleText = await title.textContent();

            const range = expRanges.nth(j);
            const minExp = await range.textContent();
            const minExpValue = minExp.split("-")[0].trim();

            if (jobKeywords.some(item => titleText.toLowerCase().includes(item.toLowerCase()))) {
                keywordMatch = true;
            }
            if (years.includes(minExpValue)) {
                minExpMatch = true;
            }

            if (keywordMatch && minExpMatch) {
                console.log(`Matched Job: ${titleText}, Experience: ${minExp}`);
                return { isMatched: true, index: j };
            }
        }
        return { isMatched: false };
    }

    // Method 2: Handle new tab/page when clicking on a job
    async findNewPageWhenClickOnJob(jobTitle) {
        const pagesBeforeClick = await this.page.context().pages();

        await jobTitle.click();

        await this.page.waitForTimeout(2000);

        const pagesAfterClick = await this.page.context().pages();
        const newPage = pagesAfterClick.find(page => !pagesBeforeClick.includes(page));

        return newPage || null;
    }

    async clickOnMatchedJobArticle() {
        // Prelocate job titles and experience ranges
        await this.page.waitForSelector(this.jobTabsList);
        const tabs= await this.page.locator(this.jobTabsList);
        const tabsCount = await tabs.count();
        const jobTitles = this.page.locator(this.jobTileElements);
        const expRanges = this.page.locator(this.expRangeElements);
    
        // Iterate through all tabs
        for (let i = 0; i < tabsCount; i++) {
            await this.handleTabClick(tabs.nth(i), jobTitles, expRanges);
        }
    }
    
    async handleTabClick(tab, jobTitles, expRanges) {
        // Click the tab and wait for page load
        await tab.click();
        await this.page.waitForLoadState('domcontentloaded');
    
        // Check if there is a matched job
        const matchResult = await this.isJobMatched(jobTitles, expRanges, this.keywords, this.years);
        if (matchResult.isMatched) {
            await this.applyForJob(jobTitles.nth(matchResult.index));
        }else{
            console.log("job not matched");
        }
    }
    
    async applyForJob(jobTitle) {
        const applyPage = await this.findNewPageWhenClickOnJob(jobTitle);
        if (!applyPage) return;
    
        try {
            // Check if the job expired alert is visible
            const jobExpiredAlert = await applyPage.locator("div[class^='styles_exp-alert-message']");
            if (await jobExpiredAlert.isVisible()) {
                console.log("Job expired");
                await applyPage.close(); // Close the page and exit
                return; // Exit the current iteration
            }
    
            // Wait for the apply page to fully load
            await applyPage.waitForLoadState('domcontentloaded');
    
            // Log the new tab's title and URL for debugging purposes
            console.log('New Tab Title:', await applyPage.title());
            console.log('New Tab URL:', applyPage.url());
    
            // Locate the Apply button
            const applyBtn = await applyPage.locator('.styles_save-job-button__WLm_s + button');
            const applyBtnText = await applyBtn.textContent();
    
            // Check button visibility and text before clicking
            if (applyBtnText === 'Apply' && await applyBtn.isVisible()) {
                await applyBtn.click();
                await applyPage.waitForLoadState('domcontentloaded');
                console.log('Applied successfully');
            } else {
                console.log("Apply button is either not visible or does not have the text 'Apply'.");
            }
        } catch (error) {
            console.error('Error applying for the job:', error);
        } finally {
            await applyPage.close(); // Ensure page is closed
        }
    }
}    

module.exports = { JobsPage };
