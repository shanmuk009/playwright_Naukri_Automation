class JobsPage {

    constructor(page) {
        this.jobTabsList = ".tab-list .tab-wrapper div:first-child"
        this.jobTileElements = ".list p"
        this.expRangeElements = ".naukicon-ot-experience + span"
        this.jobExpiredAlert = "div[class^='styles_exp-alert-message']"
        this.hideJobIcon = 'i[class*="naukicon-ot-hide"]'
        this.jobApplyBtn = '.styles_save-job-button__WLm_s + button'

        this.keywords = ['QA', 'Automation', 'Quality', 'Tester', 'Testing', 'Test', 'Assurance', 'QA Analyst', 'SDET', 'Selenium', 'Cypress', 'Test Engineer', 'Testers', 'Tosca', 'playwright']
        this.minExp = ['0', '1', '2', '3'];
    }

    async isJobMatched(jobtileText, Exprange, jobKeywords, years) {
        let keywordMatch = false;
        let minExpMatch = false;
        const minExp = await Exprange.textContent();
        const minExpValue = minExp.split("-")[0].trim();
        if (jobKeywords.find(item => jobtileText.toLowerCase().includes(item.toLowerCase()))) {
            keywordMatch = true;

        }
        if (years.includes(minExpValue)) {
            minExpMatch = true;

        }
        return keywordMatch && minExpMatch;
    }

    async clickOnMatchedJobArticle() {
        const tabs = await this.page.waitForSelector(this.jobTabsList);
        const tabsCount = await tabs.count()

        for (let i = 0; i < tabsCount; i++) {
            await tabs.nth(i).click()

            // Get the job titles and experience range locators after clicking a tab
            const jobTitles = await this.page.locator(this.jobTileElements);
            const expRanges = await this.page.locator(this.expRangeElements);


            for (let j = 0; j < await jobTitles.count(); j++) {

                const title=  jobTitles.nth(j)
                const titleText = await title.textContent();

                // Get the corresponding experience range
                const range = expRanges.nth(j);

                isJobArticleMatched=isJobMatched(titleText,range,this.keywords,this.minExp);

                if(isJobArticleMatched){

                }




            }

        }
    }

}

module.exports = { JobsPage };