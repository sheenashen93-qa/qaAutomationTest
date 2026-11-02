import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('test login with username and password', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    });

    test('testcase1, login successful with valid user and password', async({ page}) => {
        await loginPage.login("customer@practicesoftwaretesting.com","welcome01");
        await expect(page).toHaveURL(/\/account/);
        const userNameBtn = page.getByTestId('nav-menu');
        await expect(userNameBtn).toHaveText('Jane Doe');

    });

    test('testcase2, login failed with incorrect password', async({ page}) => {
        await loginPage.login("customer@practicesoftwaretesting.com","welcom02");
        const errorMessage = page.locator('.alert.alert-danger');
        await expect(errorMessage).toHaveText('Invalid email or password');
    });

    test('testcase3, login failed with empty email', async({ page}) => {
        await loginPage.login("","welcome1");
        const emailErrMsg = page.getByTestId('email-error');
        await expect(emailErrMsg).toHaveText('Email is required');
    });

    test('testcase4, login failed with incorrect email format', async({ page}) => {
        await loginPage.login("customer","welcome1");
        const emailErrMsg = page.getByTestId('email-error');
        await expect(emailErrMsg).toHaveText('Email format is invalid');
    });

})