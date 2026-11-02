import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('test the sort function', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    });

    test('testcase1, reorder the product from low price to high price', async({ page}) => {
        // 先开始等待搜索接口的响应，再触发sort
        const responsePromise = page.waitForResponse(
            r => r.url().includes('api.practicesoftwaretesting.com/products') &&
            r.request().method() === 'QUERY' &&
            r.status() === 200 &&
            r.request().postDataJSON()?.sort === 'price,asc'
        );
        await homePage.sortItems('price,asc');
        const response = await responsePromise;
        const apiPrices: number[] = (await response.json()).data.map((p: { price: number }) => p.price);
        const productPrice = page.getByTestId('product-price');

        //等页面上的价格和接口返回的完全一致，确认列表已经更新
        const expectedTexts = apiPrices.map(p => `$${p.toFixed(2)}`);
        await expect(productPrice).toHaveText(expectedTexts);

        //把页面上的价格转换成数字，检查是升序
        const uiPrices = (await productPrice.allTextContents())
            .map(text => Number(text.replace('$', '').trim()));
        const sortedPrices = [...uiPrices].sort((a, b) => a - b);
        expect(uiPrices).toEqual(sortedPrices);
    });
})