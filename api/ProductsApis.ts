import { APIRequestContext } from '@playwright/test';

interface queryParam {
            page?: number;
            sort?: string;          // 例如 'price,asc'
            between?: string;       // 例如 'price,10,30'
            by_category?: string;   // 分类 ID
            by_brand?: string;      // 品牌 ID
            is_rental?: boolean;
        }

interface searchParm {
            q?: string;
        }

const API_BASE_URL = 'https://api.practicesoftwaretesting.com/';

export class ProductApi {
    constructor(private request: APIRequestContext) {}

    async getAllProducts() {
        return await this.request.get(`${API_BASE_URL}products`);
    }
    async getProductsOnSpecificQuery(QueryParam:queryParam) {
        return await this.request.get(`${API_BASE_URL}products`, {
        params: { ...QueryParam }
        });
    }

    async searchProduct(SearchParm:searchParm) {
        return await this.request.get(`${API_BASE_URL}products/search`, {
        params: {...SearchParm}
        });
    }

    async getProductDetail(productId: string) {
        return await this.request.get(`${API_BASE_URL}products/${productId}`, {
        });
    }
}