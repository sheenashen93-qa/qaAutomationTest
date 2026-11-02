import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { UserApi } from '../../api/UserApis';
import { randomUUID } from 'crypto';
import { LoginPage } from '../../pages/LoginPage';
test.describe('test register new user', () => {

    let homePage: HomePage;
    let email: string;
    let password: string;
    let loginPage: LoginPage;
    test.beforeEach(async ({ request }) => {
      email = `test_${randomUUID()}@abc.com`;
      password = `Pw@${randomUUID().slice(0, 8)}A1`;
      const userAPI = new UserApi(request);
      const registerData ={     
        first_name: "John",
        last_name: "Doe",
        address: {
          street: "Street 1",
          house_number: "12",
          city: "City",
          state: "State",
          country: "Country",
          postal_code: "1234AA"
        },
        phone: "0987654321",
        dob: "1970-01-01",
        password: password,
        email: email
      }
      const registerResponse = await userAPI.createNewUser(registerData);
      expect(registerResponse.status()).toBe(201);
      const registerBody = await registerResponse.json();
      expect(registerBody.first_name).toBe('John');
    });
    test('testcase1, login with user created by API and verify the user name', async({ page}) => {
        homePage = new HomePage(page);
        await homePage.goto();
        const signInLink = page.getByTestId('nav-sign-in');
        await signInLink.click();
        loginPage = new LoginPage(page);
        await loginPage.login(email, password);
        const userNameBtn = page.getByTestId('nav-menu');
        await expect(userNameBtn).toHaveText('Jane Doe');
    });
}) 