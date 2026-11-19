import { test as base, expect, Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { UserApi } from '../api/UserApis';

type TestUser = { id: string; email: string; password: string; token: string };

// 2. 在内置的 test 基础上扩展自定义 fixture
export const test = base.extend<{ testUser: TestUser, loggedInPage: Page }>({

  testUser: async ({ request }, use) => {
    // ---- setup：用例开始前执行 ----
    const userApi = new UserApi(request);
    const email = `test_${randomUUID()}@abc.com`;
    const password = `Pw@${randomUUID().slice(0, 8)}A1`;
    const newUserData = {     
        first_name: "John",
        last_name: "Smith",
        address: {
          street: "Street 1",
          house_number: "12",
          city: "City",
          state: "State",
          country: "Country",
          postal_code: "1234AA"
        },
        phone: "0987654321",
        dob: "1970-01-01",
        password: password,
        email: email
      }

    const registerRes = await userApi.createNewUser(newUserData);
    expect(registerRes.status()).toBe(201);
    const { id } = await registerRes.json();

    const loginRes = await userApi.userLogin({email, password});
    expect(loginRes.status()).toBe(200);
    const { access_token: token } = await loginRes.json();

    await use({ id, email, password, token });

    // ---- teardown：用例结束后执行，用例失败也会执行 ----
    const adminLogin = await userApi.userLogin({
        email: process.env.ADMIN_EMAIL ?? 'admin@practicesoftwaretesting.com',
        password: process.env.ADMIN_PASSWORD ?? 'welcome01',
    })
    const {access_token: adminToken} = await adminLogin.json();
    const deleteUserRes = await userApi.deleteUser(id, adminToken);
    // 409：用户已有订单/发票，API 无法删除
    expect([204, 409]).toContain(deleteUserRes.status());
  },

  loggedInPage: async ({ page, testUser }, use) => {
  await page.addInitScript((t) => localStorage.setItem('auth-token', t), testUser.token);
  await use(page);
  },

});

// 3. 把 expect 一起导出，用例只需要从这一个文件导入
export { expect };
