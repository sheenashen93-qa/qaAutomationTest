import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { UserApi } from '../../api/UserApis';
import { randomUUID } from 'crypto';
test.describe('test login with API', () => {

    let email: string;
    let password: string;
    test.beforeEach('Post - Create a new user', async ({ request }) => {
      email = `test_${randomUUID()}@abc.com`;
      password = `Pw@${randomUUID().slice(0, 8)}A1`;
      const userAPI = new UserApi(request);
      const registerData ={     
        first_name: "John",
        last_name: "Smith",
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

    test('Login with API and verify the name displayed on UI', async ({ request, page }) => {
      const userAPI = new UserApi(request);
      const loginData = {
        email: email,
        password: password
      };
      const response = await userAPI.userLogin(loginData);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.access_token).toBeTruthy();
      const accessToken = body.access_token;
      //go to home Page
      const homePage = new HomePage(page);
      await homePage.goto();
      //Save token into localStorage
      await page.evaluate((token) => {
      localStorage.setItem('auth-token', token);
      }, accessToken);
      await page.goto('/account');
      await expect(page).toHaveURL(/\/account/);
      const userName = page.getByTestId('nav-menu');
      await expect(userName).toHaveText('John Smith');
    });
}) 