import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('mock product list API', () => {
    let homePage: HomePage;

    test('There is no products found', async ({ page }) => {
        await page.route('https://api.practicesoftwaretesting.com/products/search', async route => {
            const request = route.request();
            if (request.method() !== 'QUERY' || new URL(request.url()).pathname !== '/products/search') {
                return route.continue();
            }
            const response = await route.fetch();          // 先拿到真实的响应
            const body = await response.json();
            body.data = [];             // set products empty
            body.total = 0;
            body.to = 0;
            body.last_page = 1;
            await route.fulfill({ response, json: body }); // 用修改后的数据回复页面
        });
        await page.goto('/');
        await expect(page.getByTestId('product-name').first()).toBeVisible();
        await page.getByTestId('search-query').fill('pliers');
        await page.getByTestId('search-submit').click();
        await expect(page.getByTestId('product-name')).toHaveCount(0);
        await expect(page.getByTestId('no-results')).toHaveText('There are no products found.');
    });

    test('(b) modify the item out of stock and the price to 0.01', async ({ page }) => {
        homePage = new HomePage(page);
        await page.route(/^https:\/\/api\.practicesoftwaretesting\.com\/products\/[0-9A-Z]{26}$/, async route => {
            const response = await route.fetch();
            const body = await response.json();
            body.in_stock = false;
            body.price = 0.1;
            await route.fulfill({ response, json: body });
        });
        await page.goto('/');
        await homePage.viewItemDetail('Combination Pliers');
        const itemPrice = page.getByTestId('unit-price');
        const addToCart = page.getByTestId('add-to-cart');
        await expect(itemPrice).toHaveText('0.01');
        await expect(addToCart).toBeDisabled();
    });
})
