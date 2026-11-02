import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { UserApi } from '../../api/UserApis';
import { randomUUID } from 'crypto';
import { InvoiceApi } from '../../api/invoiceApis';
test.describe('test login with API', () => {

    let email: string;
    let password: string;
    test.beforeAll('Post - Create a new user', async ({ request }) => {
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
      const billingData ={     
        country: "Australia",
        postal_code: "2000",
        house_number: "42",
        state: "AMC",
      }
      const invoiceAPI = new InvoiceApi(request);
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
      await page.getByTestId('nav-home').click();
      await homePage.addProductToCart('Pliers');
      await expect(page.getByTestId('cart-quantity')).toHaveText('1');
      await page.getByTestId('nav-home').click();
      await homePage.addProductToCart('Bolt Cutters');
      await expect(page.getByTestId('cart-quantity')).toHaveText('2');
      await page.getByTestId('nav-cart').click();
      const firstItemLocation = page.locator('.table.table-hover tbody tr').nth(0);
      const firstItemQuatity = firstItemLocation.locator('td').nth(1).locator('input');
      await firstItemQuatity.fill('2');
      const firstItemPrice = await firstItemLocation.locator('td').nth(3).innerText();
      const secondIemPrice = await page.locator('.table.table-hover tbody tr').nth(1).locator('td').nth(3).innerText();
      const twoItemsPrice = Number(firstItemPrice) + Number(secondIemPrice);
      const totalPrice = Number(await page.getByTestId('cart-total').textContent());
      expect(totalPrice).toEqual(twoItemsPrice)
      const checkoutBtn = page.getByTestId('proceed-1');
      await checkoutBtn.click();
      await page.getByTestId('proceed-2').click();
      const checkoutPage = new CheckoutPage(page);
      await checkoutPage.fillBillingAddress(billingData);
      await page.getByTestId('payment-method').selectOption('Cash on Delivery');
      await page.getByTestId('finish').click();
      await expect(page.getByText('Payment was successful')).toBeVisible();
      await page.getByTestId('finish').click();
      const orderConfirmMessage = page.locator('#order-confirmation');
      await expect(orderConfirmMessage).toContainText('Thanks for your order!');
      const confirmText = await orderConfirmMessage.innerText();
      const invoiceNumber = confirmText.match(/INV-\d+/)?.[0];
      expect(invoiceNumber).toBeTruthy();
      const invoiceResponse = await invoiceAPI.getAllInvoice(accessToken);
      expect (invoiceResponse.status()).toBe(200);
      const responseBody = await invoiceResponse.json();
      console.log(responseBody);
    });

})