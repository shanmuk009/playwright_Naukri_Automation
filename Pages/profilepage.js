class ProfilePage {


    constructor(page) {
        this.page = page;

        this.delete_Resume_Icon = "span[data-title='delete-resume']"
        this.confirm_Delete_Btn = ".lightbox.model_open.flipOpen button"
        this.resume_Input = "input#attachCV"
        this.updated_Resume_Name = ".resume-name-inline div"
        this.resumeHeadLineEditIcon = '.widgetHead span:has-text("Resume headline") + span'
        this.resumeHeadLineInput = ".input-field.s12 textarea"
        this.resumeHeadLineSaveBtn = ".action.s12 button"


        this.resumepath = "tests/fixtures/Shanmuka_QA_Resume_NOV2024.pdf";
        this.resumename = "Shanmuka_QA_Resume_NOV2024.pdf"
        this.resumeHeadLineText = "Experienced Automation Tester | 2.5 Years | Proficient in Selenium, Java, playwright, JavaScript, Cucumber BDD, Hybrid Framework, SQL, Rest Assured, API Testing"


    }

    async deleteResume() {
        const deleteResume = await this.page.waitForSelector(this.delete_Resume_Icon);

        if (await deleteResume.isVisible()) {
            await this.page.locator(this.delete_Resume_Icon).click()
            await this.page.locator(this.confirm_Delete_Btn).click().then(()=>{
                console.log("resume deleted successfully")
            })
            
        }
    }

    async uploadResume() {
        await this.page.locator(this.resume_Input).setInputFiles(this.resumepath);
        console.log("Resume uploaded successfully");
    }

    async getResumeName() {
        let resumename = await this.page.locator(this.updated_Resume_Name).textContent();

        return resumename;
    }

    async updateResumeHeadLine() {
        await this.page.locator(this.resumeHeadLineEditIcon).click()
        let textarea=await this.page.locator(this.resumeHeadLineInput)
        await textarea.clear()
        await textarea.fill(this.resumeHeadLineText)
        await this.page.locator(this.resumeHeadLineSaveBtn).click();
    }


}

module.exports = { ProfilePage };