import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('test the search function', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    });

    test('testcase1, search one Item and check all the list items should contain search key words', async({ page}) => {
        // 先开始等待搜索接口的响应，再触发搜索
        const productNames = page.getByTestId('product-name');
        const responsePromise = page.waitForResponse(
            r => r.url().includes('/products/search') && r.status() === 200
        );
        await homePage.searchItem('pliers');
        const response = await responsePromise;
        const apiProducts =(await response.json()).data;
        expect(apiProducts.length).toBeGreaterThan(0);
        //verify the count of product names displayed on page is same as the response data's length;
        await expect(productNames).toHaveCount(apiProducts.length);
        const searchResult = await productNames.allTextContents();
        for (let i = 0; i < searchResult.length; i++) {
            let searchResultName = searchResult[i];
            expect(searchResultName.toLowerCase()).toContain('pliers');
        }
    });
})