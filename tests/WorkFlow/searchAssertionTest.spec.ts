import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('test the search function', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    });

    test('testcase1, search one Item and get the request', async({ page}) => {
        // 先开始等待搜索接口的响应，再触发搜索
        const productNames = page.getByTestId('product-name');
        const requestPromise = page.waitForRequest(request => request.url().includes('/products/search'));
        const responsePromise = page.waitForResponse(
            r => r.url().includes('/products/search') && r.status() === 200
        );
        await homePage.searchItem('pliers');
        const captureRequest = await requestPromise;
        const requestData = captureRequest.postDataJSON();
        expect(requestData.q).toBe('pliers');
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const apiProducts =(await response.json()).data;
        const productCountByAPI = apiProducts.length;
        //verify the count of product names displayed on page is same as the response data's length;
        expect(productCountByAPI).toBeGreaterThan(0);
        await expect(productNames).toHaveCount(productCountByAPI);
    });
})