import { test, expect } from '@playwright/test';
import { ProductApi } from '../../api/ProductsApis';
import queryCase from '../../test-data/testRange.json';

test.describe('Test the products existing in specified price range', () => {
  for (const { min, max, expectedResult } of queryCase) {
    test(`query between "price,${min},${max}" should ${expectedResult ? 'return matching products' : 'return no products'}`, async ({ request }) => {
      const productAPI = new ProductApi(request);
      const priceQuery = {
        between: `price,${min},${max}`
      };
      const response = await productAPI.getProductsOnSpecificQuery(priceQuery);
      expect(response.status()).toBe(200);
      const queryBody = await response.json();
      const productPrice: number[] = queryBody.data.map((item: {price: number}) => item.price);
      if (expectedResult) {
        expect(queryBody.data.length).toBeGreaterThan(0);
        for (const price of productPrice) {
          expect(price).toBeGreaterThanOrEqual(min);
          expect(price).toBeLessThanOrEqual(max);
        }
      }
      else {
        expect(queryBody.data.length).toBe(0);
      }
    });
  }
});

