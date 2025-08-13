import { expect, Locator, Page } from "@playwright/test";


class HomePage {
    readonly lblRegistredUser: Locator;

    constructor(page: Page) {

        this.lblRegistredUser = page.getByText('Registered Users');

    }
    async expectUserIsLoggedIn() {
        await expect(this.lblRegistredUser).toBeVisible();

    }

}
export default HomePage;
