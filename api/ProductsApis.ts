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
    q: string;       // 必填，搜索关键词
    page?: number;   // 可选，页码
}

interface newParam {
    name: string;
    description: string;          // 例如 'price,asc'
    price: number;       // 例如 'price,10,30'
    category_id: string;   // 分类 ID
    brand_id: string;      // 品牌 ID
    product_image_id: string;
    is_location_offer: number;
    is_rental: number;
    co2_rating: string;
    stock?: number;           // 文档未列出，用于设置库存
}

const API_BASE_URL = 'https://api.practicesoftwaretesting.com/';

export class ProductApi {
    constructor(private request: APIRequestContext) { }

    async getAllProducts() {
        return await this.request.get(`${API_BASE_URL}products`);
    }
    async getProductsOnSpecificQuery(QueryParam: queryParam) {
        return await this.request.get(`${API_BASE_URL}products`, {
            params: { ...QueryParam }
        });
    }

    async searchProduct(SearchParm: searchParm) {
        return await this.request.get(`${API_BASE_URL}products/search`, {
            params: { ...SearchParm }
        });
    }

    async getProductDetail(productId: string) {
        return await this.request.get(`${API_BASE_URL}products/${productId}`, {
        });
    }

    async createNewProduct(NewParam: newParam) {
        return await this.request.post(`${API_BASE_URL}products`, {
            data: NewParam
        });
    }

    async deleteProduct(productId: string, bearToken: string) {
        return await this.request.delete(`${API_BASE_URL}products/${productId}`, {
            headers: { Authorization: `Bearer ${bearToken}` }
        });
    }
}