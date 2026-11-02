import { test, expect } from '@playwright/test';
import { UserApi } from '../../api/UserApis';
import { randomUUID } from 'crypto';

test.describe('User related API Tests', () => {
    let email: string;
    let password: string;

    test.beforeEach('Post - Create a new user', async ({ request }) => {
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
    test('Login successful with correct username and password', async ({ request }) => {
      const userAPI = new UserApi(request);
      const loginData = {
        email: email,
        password: password
      };
      const response = await userAPI.userLogin(loginData);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.access_token).toBeTruthy();
    });

    test('Login failed with incorrect username or password', async ({ request }) => {
      const userAPI = new UserApi(request);
      const incorrectPassword = `Pw@${randomUUID().slice(0, 8)}A2`;
      const incorrectLoginData = {
        email: email,
        password: incorrectPassword
      }
      const response = await userAPI.userLogin(incorrectLoginData);
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Unauthorized');
    });

    test('Get user email successful with valid token and 401 error return without token', async ({ request }) => {
      const userAPI = new UserApi(request);
      const correctLoginData = {
        email: email,
        password: password
      }
      const response = await userAPI.userLogin(correctLoginData);
      expect(response.status()).toBe(200);
      const body = await response.json();
      const accessToken = body.access_token;
      const getResponse = await userAPI.getUser(accessToken);
      expect(getResponse.status()).toBe(200);
      const getBody = await getResponse.json();
      expect(getBody.email).toBe(email);
      const errorResponse = await userAPI.getUserWithoutToken();
      expect(errorResponse.status()).toBe(401);
      expect((await errorResponse.json()).message).toBe('Unauthorized');
    });

})