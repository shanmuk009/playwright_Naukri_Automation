class HomePage{

    constructor(page){
        this.page=page;
        this.view_Profile_Btn=".view-profile-wrapper a"
        this.delete_Resume_Icon="span[data-title='delete-resume']"
        this.confirm_Delete_Btn=".lightbox.model_open.flipOpen button"

        this.JobsPage='.nI-gNb-menus li a div:has-text("Jobs")'
       
    }

    async click_On_ViewProfile(){
       await this.page.locator(this.view_Profile_Btn).first().click()
    }

    async click_On_Jobs(){
        await this.page.locator(this.JobsPage).click()
    }
}

module.exports= {HomePage};