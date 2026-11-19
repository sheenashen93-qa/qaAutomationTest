import { test, expect } from '../../fixtures/productFixture';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('test whole purchase process', () => {
    
    test('Login with API and verify the name displayed on UI', async ({ loggedInPage: page  }) => {
      await page.goto('/account');
      await expect(page).toHaveURL(/\/account/);
      const userName = page.getByTestId('nav-menu');
      await expect(userName).toHaveText('John Smith');
    });

    test('Create a product and add it to chart', async ({ loggedInPage: page, newProduct }) => {
      const billingData ={     
        country: "Australia",
        postal_code: "2000",
        house_number: "42",
        state: "AMC",
      }
      await page.goto('/');
      // 等首页商品列表加载完再搜索，否则首页列表的响应可能晚到，覆盖掉搜索结果
      await expect(page.getByTestId('product-name').first()).toBeVisible();
      await page.getByTestId('search-query').fill(newProduct.name);
      await page.getByTestId('search-submit').click();
      const newHammerLocator = page.locator(`[alt="${newProduct.name}"]`).nth(0);
      await expect(newHammerLocator).toBeVisible();
      await newHammerLocator.click();
      await page.getByTestId('add-to-cart').click();
      await page.getByTestId('cart-quantity').click();
      //const itemCell = page.locator('#table.table-hover ')
      await expect(page.getByTestId('product-title')).toHaveText(newProduct.name);
      await page.getByTestId('proceed-1').click();
      await page.getByTestId('proceed-2').click();
      const checkoutPage = new CheckoutPage(page);
      await checkoutPage.fillBillingAddress(billingData);
      await page.getByTestId('payment-method').selectOption('Cash on Delivery');
      await page.getByTestId('finish').click();
      await expect(page.getByText('Payment was successful')).toBeVisible();
      await page.getByTestId('finish').click();
    });

})