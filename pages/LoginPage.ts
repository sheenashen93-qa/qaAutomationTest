import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;
    readonly registerLink: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly birthday: Locator;
    readonly country: Locator;
    readonly postcode: Locator;
    readonly houseNumber: Locator;
    readonly street: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly phone: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly registerBtn: Locator;

    constructor (page: Page) {
        this.page = page;
        this.userNameInput = page.getByTestId('email');
        this.passwordInput = page.getByTestId('password');
        this.loginBtn = page.getByTestId('login-submit');
        this.registerLink = page.getByTestId('register-link');
        this.firstName = page.getByTestId('first-name');
        this.lastName = page.getByTestId('last-name');
        this.birthday = page.getByTestId('dob');
        this.country = page.getByTestId('country');
        this.postcode = page.getByTestId('postal_code');
        this.houseNumber = page.getByTestId('house_number');
        this.street = page.getByTestId('street');
        this.city = page.getByTestId('city');
        this.state = page.getByTestId('state');
        this.phone = page.getByTestId('phone');
        this.email = page.getByTestId('email');
        this.password = page.getByTestId('password');
        this.registerBtn = page.getByTestId('register-submit');
    }

    async goto(): Promise<void> {
    await this.page.goto('/auth/login');
    }
    async login(userName: string, password: string): Promise<void> {
        await this.userNameInput.fill(userName);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
    }

    async registerNewUser(userData: string[]): Promise<void> {
        await this.registerLink.click();
        await this.firstName.fill(userData[0]);
        await this.lastName.fill(userData[1]);
        await this.birthday.fill(userData[2]);
        await this.country.selectOption(userData[3]);
        await this.postcode.fill(userData[4]);
        await this.houseNumber.fill(userData[5]);
        await this.street.fill(userData[6]);
        await this.state.fill(userData[7]);
        await this.phone.fill(userData[8]);
        await this.email.fill(userData[9]);
        await this.password.fill(userData[10]);
        await this.registerBtn.click();
    }
}