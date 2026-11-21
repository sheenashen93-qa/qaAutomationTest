import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('test the sort function', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    });

    test('testcase1, reorder the product from low price to high price', async({ page}) => {
        // wait for the response of QUERY and then trigger sort
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

        //make sure the prices shown on UI are consistent with the API's response
        const expectedTexts = apiPrices.map(p => `$${p.toFixed(2)}`);
        await expect(productPrice).toHaveText(expectedTexts);

        //cover the prices shown on UI to number and verify the prices are accending
        const uiPrices = (await productPrice.allTextContents())
            .map(text => Number(text.replace('$', '').trim()));
        const sortedPrices = [...uiPrices].sort((a, b) => a - b);
        expect(uiPrices).toEqual(sortedPrices);
    });
})