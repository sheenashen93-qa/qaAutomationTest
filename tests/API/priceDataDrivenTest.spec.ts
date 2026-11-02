import { test, expect } from '@playwright/test';
import { ProductApi } from '../../api/ProductsApis';

const queryCase = [
  { min: 10, max: 50, expectedResult: true },
  { min: 0, max: 5, expectedResult: true },
  { min: 0, max: 1000, expectedResult: true },
  { min: 10000, max: 20000, expectedResult: false },
  { min: 10, max: 10, expectedResult: false },
];

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

