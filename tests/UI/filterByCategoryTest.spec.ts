import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('test the sort function', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    });

    test('testcase1, filter the displayed items by category', async({ page}) => {
        // 先开始等待搜索接口的响应，再触发select category
        const hammerCheckbox = page.getByLabel('Hammer', { exact: true });
        const hammerId = await hammerCheckbox.getAttribute('value');   // 运行时读取 ID

        const responsePromise = page.waitForResponse(r =>
            r.url().includes('api.practicesoftwaretesting.com/products') &&
            r.request().method() === 'QUERY' &&
            r.status() === 200 &&
            r.request().postDataJSON()?.by_category === hammerId
        );
        await hammerCheckbox.check();
        const response = await responsePromise;
        const apiProducts = (await response.json()).data;
        const productName = page.getByTestId('product-name');
        //先判断页面已经更新，即页面上显示的商品个数与api的返回结果一致，再去判断每个商品名称
        await expect(productName).toHaveCount(apiProducts.length);
        const productNameText = await productName.allTextContents();
        for (const product of productNameText) {
           expect(product.toLowerCase()).toContain("hammer");
        }
    });
})