import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
test.describe('test search Hammer', () => {

    let homePage: HomePage;
    test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    });
    test('testcase1, search Hammer and verify all the items displayed on page contains Hammer', async({ page}) => {
        // 先开始等待搜索接口的响应，再触发搜索
        const productNames = page.getByTestId('product-name');
        const responsePromise = page.waitForResponse(
            r => r.url().includes('/products/search') && r.status() === 200
        );
        await homePage.searchItem('hammer');
        const response = await responsePromise;
        const apiProducts = (await response.json()).data;
        expect(apiProducts.length).toBeGreaterThan(0);
        const allSearchedItems = await productNames.allTextContents();
        expect(allSearchedItems.length).toEqual(apiProducts.length);
        for (const name of allSearchedItems) {
            expect(name.toLowerCase()).toContain('hammer');
        }
    });
}) 