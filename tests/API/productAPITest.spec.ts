import { test, expect } from '@playwright/test';
import { ProductApi } from '../../api/ProductsApis';

test.describe('Product related API Tests', () => {
    test('Get all products and check the result', async ({ request }) => {
      const productAPI = new ProductApi(request);
      const response = await productAPI.getAllProducts();
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.last_page).toBeGreaterThan(1);
    });

    test('Get products on a specific page', async ({ request }) => {
      const productAPI = new ProductApi(request);
      const pageQuery1 = {
        page: 1
      }
      const pageQuery2 = {
        page: 2
      }
      const response1 = await productAPI.getProductsOnSpecificQuery(pageQuery1);
      expect(response1.status()).toBe(200);
      const page1Result = await response1.json();
      const response2 = await productAPI.getProductsOnSpecificQuery(pageQuery2);
      expect(response2.status()).toBe(200);
      const page2Result = await response2.json();
      const page1Data = page1Result.data;
      const page2Data = page2Result.data;
      expect(page1Result.current_page).toBe(1);
      expect(page2Result.current_page).toBe(2);
      expect(page2Result.from).toBe(page1Result.to + 1);
      const page1DataId: number[] = [];
      const page2DataId: number[] = [];
      for (let i = 0; i < page1Data.length; i++) {
          page1DataId.push(page1Data[i].id)
      }
      for (let j = 0; j < page2Data.length; j++) {
          page2DataId.push(page2Data[j].id)
      }

      const noDuplicates = page1DataId.every(item => !page2DataId.includes(item));
      expect(noDuplicates).toBe(true);
    });

    test('Search for a specific product', async ({ request }) => {
      const productAPI = new ProductApi(request);
      const searchParm = {
            q: "pliers"
      }
      const response = await productAPI.searchProduct(searchParm);
      expect(response.status()).toBe(200);
      const searchBody = await response.json();
      const searchResultData = searchBody.data;
      const searchResult: string[] = [];
      for (let i = 0; i < searchResultData.length; i++) {
            searchResult.push(searchResultData[i].name)
      }
      const allItemsContainPliers = searchResult.every(item => item.toLowerCase().includes("pliers"));
      expect(allItemsContainPliers).toBe(true);
    });
})