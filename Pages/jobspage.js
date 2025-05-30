class JobsPage {

    constructor(page) {
        this.page = page;
        this.jobTabsList = ".tab-list .tab-wrapper div:first-child";
        this.jobTileElements = ".list p";
        this.expRangeElements = ".naukicon-ot-experience + span";
        this.jobApplyBtn = '.styles_save-job-button__WLm_s + button';
        this.apply_status_header = ".apply-status-header.green";
        this.hideIcon = 'i[class*="naukicon-ot-hide"]';
        //this.jobTitles;

        this.keywords = [
            'QA', 'Automation', 'Quality', 'Tester', 'Testing', 'Test',
            'Assurance', 'QA Analyst', 'SDET', 'Selenium', 'Cypress',
            'Test Engineer', 'Testers', 'Tosca', 'Playwright'
        ];
        this.years = ['0', '1', '2', '3','4'];
    }

    // Method 1: Check if a job matches the criteria
    async isJobMatched(jobTitles, expRanges, jobKeywords, years) {
        let keywordMatch = false;
        let minExpMatch = false;

        let jobTitleCount = await jobTitles.count();
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

            // If both conditions are true, return a match result
            if (keywordMatch && minExpMatch) {
                console.log(`Matched Job: ${title}, Experience: ${range}`);
                const applypage=this.findNewPageWhenClickOnJob(title);
                this.applyForJob(applypage)



            } else {
                // Return unmatched result for this iteration
                console.log(`Unmatched Job: ${title}, Experience: ${range}`);
                this.hideUnmatchedJobs(j);
                jobTitleCount--;


            }

        }
    }

    // Method 2: Handle new tab/page when clicking on a job
    async findNewPageWhenClickOnJob(jobTitle) {
        const pagesBeforeClick = await this.page.context().pages();

        await jobTitle.click();

        await this.page.waitForTimeout(5000);

        const pagesAfterClick = await this.page.context().pages();
        const newPage = pagesAfterClick.find(page => !pagesBeforeClick.includes(page));

        return newPage || null;
    }

    async clickOnMatchedJobArticle() {
        await this.page.waitForSelector(this.jobTabsList);
        const tabs = this.page.locator(this.jobTabsList);
        const tabsCount = await tabs.count();
    
        for (let i = 0; i < tabsCount; i++) {
            await tabs.nth(i).click();
            await this.page.waitForLoadState('domcontentloaded');
    
            const jobTitles = this.page.locator(this.jobTileElements);
            const expRanges = this.page.locator(this.expRangeElements);
    
            const matchResult = await this.isJobMatched(jobTitles, expRanges, this.keywords, this.years);
    
            if (matchResult.isMatched) {
                const matchedJob = jobTitles.nth(matchResult.index);
                const applyPage = await this.findNewPageWhenClickOnJob(matchedJob);
                const success = await this.applyForJob(applyPage);
    
                if (!success) {
                    console.log(`Failed to apply for job at index ${matchResult.index}`);
                }
            } else {
                await this.hideUnmatchedJobs(matchResult.index);
            }
        }
    }

    async hideUnmatchedJobs(jobIndex) {
        try {
            const hideIcon = this.page.locator(this.hideIcon).nth(jobIndex);
            await hideIcon.click();
            console.log(`Job at index ${jobIndex} hidden successfully.`);
            return true;
        } catch (error) {
            console.error(`Error hiding job at index ${jobIndex}:`, error);
            return false;
        }
    }
    

    async validateSuccessMessage(applyPage) {
        try {
            const applyStatusHeader = await applyPage.locator(this.apply_status_header);
            await expect(applyStatusHeader).toBeVisible();
            console.log("Job applied successfully");
        } catch (error) {
            console.log("applystatusheader not visible")
        }
    }


    async applyForJob(applyPage) {
        if (!applyPage) {
            console.log("No new page found for applying to the job.");
            return false;
        }
    
        try {
            const jobExpiredAlert = await applyPage.locator("div[class^='styles_exp-alert-message']");
            if (await jobExpiredAlert.isVisible()) {
                console.log("Job expired");
                return false;
            }
    
            await applyPage.waitForLoadState('domcontentloaded');
            console.log('New Tab Title:', await applyPage.title());
            console.log('New Tab URL:', applyPage.url());
    
            const applyBtn = await applyPage.locator(this.jobApplyBtn);
            if (await applyBtn.isVisible() && (await applyBtn.textContent()) === 'Apply') {
                await applyBtn.click();
                await this.validateSuccessMessage(applyPage);
                return true;
            } else {
                console.log("Apply button not visible or invalid.");
                return false;
            }
        } catch (error) {
            console.error("Error applying for the job:", error);
            return false;
        } finally {
            await applyPage.close();
        }
    }
}    

module.exports = { JobsPage };
