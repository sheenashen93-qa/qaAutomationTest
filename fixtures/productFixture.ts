import { expect, test as userTest } from './userFixture';
import { randomUUID } from 'crypto';
import { ProductApi } from '../api/ProductsApis';
import { UserApi } from '../api/UserApis';

type Product = { id: string; name: string; price: number; in_stock: boolean };

// 2. 在内置的 test 基础上扩展自定义 fixture
export const test = userTest.extend<{ newProduct: Product }>({

  newProduct: async ({ request }, use) => {

    // ---- setup：用例开始前执行 ----
    const productApi = new ProductApi(request);
    const API = 'https://api.practicesoftwaretesting.com';
    const [category] = await (await request.get(`${API}/categories`)).json();
    const [brand] = await (await request.get(`${API}/brands`)).json();
    const [image] = await (await request.get(`${API}/images`)).json();

    const newProduct = {
      name: `NewHammer${randomUUID().slice(0, 8)}`,   // 唯一名字，避免搜到旧数据（不要用下划线，搜索不支持）
      description: "New for sell",
      price: 1.99,
      category_id: category.id,
      brand_id: brand.id,
      product_image_id: image.id,
      is_location_offer: 1,
      is_rental: 0,
      co2_rating: "A",
      stock: 10,          // Swagger 未列出，但不传的话新商品是 out of stock
    }
    const productCreate = await productApi.createNewProduct(newProduct);
    expect(productCreate.status()).toBe(201);
    const product: Product = await productCreate.json();
    const productId = product.id;

    await use(product);


    // ---- teardown：用例结束后执行，用例失败也会执行 ----
    const userApi = new UserApi(request);
    const adminLogin = await userApi.userLogin({
      email: process.env.ADMIN_EMAIL ?? 'admin@practicesoftwaretesting.com',
      password: process.env.ADMIN_PASSWORD ?? 'welcome01',
    })
    const { access_token: adminToken } = await adminLogin.json();
    const deleteProduct = await productApi.deleteProduct(productId, adminToken)
    // 409：商品已在订单/购物车中，API 无法删除（练习网站会定期重置数据库）
    expect([204, 409]).toContain(deleteProduct.status());
  },

});

// 3. 把 expect 一起导出，用例只需要从这一个文件导入
export { expect };
