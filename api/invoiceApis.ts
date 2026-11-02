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

export class InvoiceApi {
    constructor(private request: APIRequestContext) {}

    async getAllInvoice(token:string) {
        return await this.request.get(`${API_BASE_URL}invoices`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}