import { expect, Locator, Page } from "@playwright/test";


class LoginPage {
  readonly txtLoginEmail: Locator;
  readonly txtLoginPassword: Locator;
  readonly btnLogin: Locator;
  readonly txtSignUpEmail: Locator;
  readonly txtSignPassword: Locator;
  readonly btnLoginPageSignUp: Locator;
  readonly btnSignPop: Locator;
  readonly lblSuccessfullyLogin: Locator;

  constructor(page: Page) {

    this.txtLoginEmail = page.getByRole('textbox', { name: 'Email Email:' })
    this.txtLoginPassword = page.getByRole('textbox', { name: 'Password Password:' })
    this.btnLogin = page.getByRole('button', { name: 'login' })
    this.btnLoginPageSignUp = page.locator('#signupLink');
    this.btnSignPop = page.getByRole('button', { name: 'Sign up' })
    this.txtSignUpEmail = page.locator('#signupModal #email');
    this.txtSignPassword = page.locator('#signupModal #password');
    this.lblSuccessfullyLogin = page.getByText('User signed up successfully!')

  }
  async userLogin(email: string, password: string) {
    await this.txtLoginEmail.fill(email);
    await this.txtLoginPassword.fill(password);
    await this.btnLogin.click();
  }
  async userSignUp(email: string, password: string) {
    await this.txtSignUpEmail.fill(email);
    await this.txtSignPassword.fill(password);
    await this.btnSignPop.click();
  }
  async openSignUpPopUp() {
    await this.btnLoginPageSignUp.click();
  }
  async expectUserLoggedIn() {
    await expect(this.lblSuccessfullyLogin).toBeVisible()
  }

}
export default LoginPage;
