import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { UserApi } from '../../api/UserApis';
import { randomUUID } from 'crypto';
import { LoginPage } from '../../pages/LoginPage';
import {FavoriteApi} from '../../api/FavoriteApis';
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

    test('Login and add favorite', async ({ page, request }) => {
      //go to home Page and login with username and password
      const loginPage = new LoginPage(page);
      const favoriteAPI = new FavoriteApi(request);
      await loginPage.goto();
      await loginPage.login(email, password);
      const userNameLocator = page.getByTestId('nav-menu');
      await expect(userNameLocator).toHaveText('John Smith');
      const token = await page.evaluate(() => localStorage.getItem('auth-token'));
      expect(token).toBeTruthy();
      if (!token) throw new Error('auth-token not found in localStorage');
      const homePage = new HomePage(page);
      await homePage.goto(); 
      const sortLocator = page.getByTestId('sort');
      await sortLocator.selectOption('name,asc');
      const selectItemLocator = page.getByAltText('Adjustable Wrench');
      await selectItemLocator.click();
      const productNameLocator = page.getByTestId('product-name');
      await expect(productNameLocator).toHaveText('Adjustable Wrench');
      const addFavorite = page.waitForResponse(r =>
      r.url().includes('/favorites') && r.request().method() === 'POST');
      await page.getByTestId('add-to-favorites').click();
      await addFavorite;
      const favoriteResponse = await favoriteAPI.getFavorite(token);
      expect(favoriteResponse.status()).toBe(200);
      const favoriteItems = await favoriteResponse.json()
      const itemNames: string[] = [];
      let favoriteId = "";
      for (let i = 0; i < favoriteItems.length; i++) {
            itemNames.push(favoriteItems[i].product.name)
            if (favoriteItems[i].product.name === "Adjustable Wrench")
            {
              favoriteId = favoriteItems[i].id;
            }
      }
      expect(itemNames).toContain('Adjustable Wrench');
      const deleteResponse = await favoriteAPI.deleteFavorite(token,favoriteId);
      expect(deleteResponse.status()).toBe(204);
      const favoriteResponseAfter = await favoriteAPI.getFavorite(token);
      const favoriteItemsAfter = await favoriteResponseAfter.json()
      const itemNamesAfter: string[] = [];
      for (let i = 0; i < favoriteItemsAfter.length; i++) {
            itemNamesAfter.push(favoriteItemsAfter[i].product.name)
      }
      expect(itemNamesAfter).not.toContain('Adjustable Wrench');
    });
}) 