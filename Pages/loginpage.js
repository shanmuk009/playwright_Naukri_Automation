class LoginPage {

    constructor(page) {
        this.page = page
        this.login_layer = "#login_Layer"
        this.userName = "Enter your active Email ID / Username"
        this.password = "Enter your password"
        this.submit_Btn = "button[type='submit']"

    }

    async navigateToNaukri(url){
        await this.page.goto(url);
    }
    async naukriLogin() {
        await this.page.locator(this.login_layer).click();
        await this.page.getByPlaceholder(this.userName).fill('shanmukhbandaru9961@gmail.com')
        await this.page.getByPlaceholder(this.password).fill('Shancol@24')
        await this.page.locator(this.submit_Btn).click();
    }
}

module.exports = { LoginPage };