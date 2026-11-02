import { APIRequestContext } from '@playwright/test';

interface LoginRequest {
        email: string;
        password: string;
    }

interface CreateNewUserData {
            first_name: string;
            last_name: string;
            address: {
                street: string,
                house_number: string,
                city: string,
                state: string,
                country: string,
                postal_code: string
            },
            phone: string,
            dob: string,
            password: string,
            email: string
    }

const API_BASE_URL = 'https://api.practicesoftwaretesting.com/';

export class UserApi {
    constructor(private request: APIRequestContext) {}

    async userLogin(loginData: LoginRequest) {
        return await this.request.post(`${API_BASE_URL}users/login`, {
        data: loginData
    });
    }

    async createNewUser(newUserData: CreateNewUserData) {
        return await this.request.post(`${API_BASE_URL}users/register`, {
        data: newUserData
    });
    }

    async getUser(token:string) {
        return await this.request.get(`${API_BASE_URL}users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
    });
    }

    async getUserWithoutToken() {
        return await this.request.get(`${API_BASE_URL}users/me`);
    }
}