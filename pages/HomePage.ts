import { Page, Locator, expect } from '@playwright/test';
import { text } from 'node:stream/consumers';


export class HomePage {
    readonly page: Page;
    readonly searchBoxInput: Locator;
    readonly searchBtn: Locator;
    readonly sortDropdown: Locator;
    readonly productPrices: Locator;

    constructor (page: Page) {
        this.page = page;
        this.searchBoxInput = page.getByTestId('search-query');
        this.searchBtn = page.getByTestId('search-submit');
        this.sortDropdown = page.getByTestId('sort');
        this.productPrices = page.getByTestId('product-price');

    }

    async goto(): Promise<void> {
        // 先开始等待首页加载商品的请求，再打开页面
        const initialLoad = this.page.waitForResponse(r =>
            r.url().includes('api.practicesoftwaretesting.com/products') &&
            r.request().method() === 'QUERY' &&
            r.status() === 200
        );
        await this.page.goto('/');
        const response = await initialLoad;
        const count = (await response.json()).data.length;
        // 页面显示的商品数量和接口返回的一致，说明列表已经全部显示
        await expect(this.productPrices).toHaveCount(count);
    }

    async searchItem(searchItemName: string): Promise<void> {
        await this.searchBoxInput.fill(searchItemName);
        await this.searchBtn.click();
    }

    async sortItems(sortValue: string): Promise<void> {
        await this.sortDropdown.selectOption(sortValue);
    }

    async viewItemDetail(productName: string): Promise<void> {
        await this.page.getByAltText(productName).click();
    }

    async addProductToCart(productName: string): Promise<void> {
        await this.page.getByAltText(productName, { exact: true }).click();
        const addToCartBtn = this.page.getByTestId('add-to-cart');
        await addToCartBtn.click();
    }

}