import { test, expect } from '@playwright/test';

test.describe('mock product list API', () => {

    test('(a) page shows only 1 product when API returns 1', async ({ page }) => {
        await page.route('https://api.practicesoftwaretesting.com/products*', async route => {
            const request = route.request();
            // 只处理首页加载商品列表的请求，其他请求放行
            if (request.method() !== 'QUERY' || new URL(request.url()).pathname !== '/products') {
                return route.continue();
            }
            const response = await route.fetch();          // 先拿到真实的响应
            const body = await response.json();
            body.data = body.data.slice(0, 1);             // 只保留第 1 个商品
            body.total = 1;
            body.to = 1;
            body.last_page = 1;
            await route.fulfill({ response, json: body }); // 用修改后的数据回复页面
        });

        await page.goto('/');
        await expect(page.getByTestId('product-name')).toHaveCount(1);
    });

    test('(b) age handles 500 error from product list API', async ({ page }) => {
        await page.route('https://api.practicesoftwaretesting.com/products*', async route => {
            const request = route.request();
            // 只处理首页加载商品列表的请求，其他请求放行
            if (request.method() !== 'QUERY' || new URL(request.url()).pathname !== '/products') {
                return route.continue();
            }
            await route.fulfill({
                status: 500,
                json: { message: 'Internal Server Error' },
            });
        });
        await page.goto('/');
        await expect(page.getByTestId('product-name')).toHaveCount(0);
    });
})
