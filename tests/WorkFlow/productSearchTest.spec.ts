import { test, expect } from '@playwright/test';
import { ProductApi } from '../../api/ProductsApis';
import { HomePage } from '../../pages/HomePage';

test.describe('Test search function with both API and UI', () => {
        let homePage: HomePage;
        test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        });

      test('Search pliers with both API and UI', async ({ request, page}) => {
        //get result from API
        const productAPI = new ProductApi(request);
        const searchParm = {
              q: "pliers"
        }
        const apiResponse = await productAPI.searchProduct(searchParm);
        expect(apiResponse.status()).toBe(200);
        const body = await apiResponse.json();
        const searchResultData = body.data;
        const searchResult: string[] = [];
        for (let i = 0; i < searchResultData.length; i++) {
            searchResult.push(searchResultData[i].name)
        }
        const allItemsContainPliers = searchResult.every(item => item.toLowerCase().includes("pliers"));
        expect(allItemsContainPliers).toBe(true);
        //get result from UI
        const productNames = page.getByTestId('product-name');
        const responsePromise = page.waitForResponse(
            r => r.url().includes('/products/search') && r.status() === 200
        );
        await homePage.searchItem("pliers");
        const uiResponse = await responsePromise;
        expect(uiResponse.status()).toBe(200);
        const responseData = (await uiResponse.json()).data;
        await expect(productNames).toHaveCount(responseData.length);
        const productNamesText = (await productNames.allTextContents()).map(s => s.trim());
        expect([...searchResult].sort()).toEqual([...productNamesText].sort());


      });


})