import { Page, Locator } from '@playwright/test';
type BillingAddress = {
    country: string;
    postal_code: string;
    house_number: string;
    state: string;
};

export class CheckoutPage {
    readonly page: Page;
    readonly country: Locator;
    readonly postcode: Locator;
    readonly houseNumber: Locator;
    readonly state: Locator;
    readonly proceedBtn: Locator;

    constructor (page: Page) {
        this.page = page;
        this.country = page.getByTestId('country');
        this.postcode = page.getByTestId('postal_code');
        this.houseNumber = page.getByTestId('house_number');
        this.state = page.getByTestId('state');
        this.proceedBtn = page.getByTestId('proceed-3');
    }

    async goto(): Promise<void> {
    await this.page.goto('/auth/login');
    }

    async fillBillingAddress(billingData: BillingAddress): Promise<void> {
        await this.country.selectOption(billingData.country);
        await this.postcode.fill(billingData.postal_code);
        await this.houseNumber.fill(billingData.house_number);
        await this.state.fill(billingData.state);
        await this.proceedBtn.click();
    }
}