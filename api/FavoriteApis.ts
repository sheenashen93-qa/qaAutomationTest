import { APIRequestContext } from '@playwright/test';

const API_BASE_URL = 'https://api.practicesoftwaretesting.com/';

export class FavoriteApi {
    constructor(private request: APIRequestContext) {}

    async getFavorite(token:string) {
        return await this.request.get(`${API_BASE_URL}favorites`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    async deleteFavorite(token:string, id:string) {
        return await this.request.delete(`${API_BASE_URL}favorites/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}