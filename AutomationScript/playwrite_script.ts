import { test, expect, Page, Locator } from '@playwright/test';

/**
 * PAGE OBJECT MODEL: RegisterPage
 * Encapsulates all selectors and actions for the ParaBank Registration Page.
 */
class RegisterPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipInput: Locator;
    readonly phoneInput: Locator;
    readonly ssnInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly registerButton: Locator;
    readonly successTitle: Locator;
    readonly errorMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('input[id="customer.firstName"]');
        this.lastNameInput = page.locator('input[id="customer.lastName"]');
        this.addressInput = page.locator('input[id="customer.address.street"]');
        this.cityInput = page.locator('input[id="customer.address.city"]');
        this.stateInput = page.locator('input[id="customer.address.state"]');
        this.zipInput = page.locator('input[id="customer.address.zipCode"]');
        this.phoneInput = page.locator('input[id="customer.phoneNumber"]');
        this.ssnInput = page.locator('input[id="customer.ssn"]');
        this.usernameInput = page.locator('input[id="customer.username"]');
        this.passwordInput = page.locator('input[id="customer.password"]');
        this.confirmPasswordInput = page.locator('input[id="repeatedPassword"]');
        this.registerButton = page.locator('input[value="Register"]');
        this.successTitle = page.locator('h1.title');
        this.errorMessages = page.locator('span.error');
    }

    async navigate() {
        await this.page.goto('https://parabank.parasoft.com/parabank/register.htm');
    }

    async fillRegistrationForm(data: any) {
        if (data.firstName) await this.firstNameInput.fill(data.firstName);
        if (data.lastName) await this.lastNameInput.fill(data.lastName);
        if (data.address) await this.addressInput.fill(data.address);
        if (data.city) await this.cityInput.fill(data.city);
        if (data.state) await this.stateInput.fill(data.state);
        if (data.zip) await this.zipInput.fill(data.zip);
        if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
        if (data.ssn) await this.ssnInput.fill(data.ssn);
        if (data.username) await this.usernameInput.fill(data.username);
        if (data.password) await this.passwordInput.fill(data.password);
        if (data.confirmPassword) await this.confirmPasswordInput.fill(data.confirmPassword);
    }

    async submit() {
        await this.registerButton.click();
    }

    async getSpecificError(id: string): Promise<Locator> {
        return this.page.locator(`span[id="${id}.errors"]`);
    }
}

/**
 * PROFESSIONAL TEST SUITE
 * Uses Page Object Model for scalability and maintainability.
 */
test.describe('Professional Registration Audit Suite', () => {
    let registerPage: RegisterPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        await registerPage.navigate();
    });

    test('TC_REG_01: Successful Registration Flow', async () => {
        const uniqueUser = `qa_pro_${Date.now()}`;
        await registerPage.fillRegistrationForm({
            firstName: 'Professional',
            lastName: 'Tester',
            address: '101 QA Lane',
            city: 'Silicon Valley',
            state: 'CA',
            zip: '94025',
            ssn: '000-00-0000',
            username: uniqueUser,
            password: 'SecurePass123!',
            confirmPassword: 'SecurePass123!'
        });
        await registerPage.submit();
        await expect(registerPage.successTitle).toContainText('Welcome');
    });

    test('TC_REG_02: Mandatory Field Validation Check', async () => {
        await registerPage.submit();
        // Batch validation check
        const fields = ['customer.firstName', 'customer.lastName', 'customer.username', 'customer.password'];
        for (const field of fields) {
            await expect(await registerPage.getSpecificError(field)).toBeVisible();
        }
    });

    test('TC_REG_03: Security - Password Mismatch Guard', async () => {
        await registerPage.fillRegistrationForm({
            password: 'PassA',
            confirmPassword: 'PassB'
        });
        await registerPage.submit();
        const error = await registerPage.getSpecificError('repeatedPassword');
        await expect(error).toContainText('Passwords did not match.');
    });

    test('TC_REG_04: Duplicate Identity Prevention', async () => {
        const existingUser = 'pro_audit_user';
        // First Attempt
        await registerPage.fillRegistrationForm({ username: existingUser, password: '123', confirmPassword: '123' });
        await registerPage.submit();
        
        // Second Attempt
        await registerPage.navigate();
        await registerPage.fillRegistrationForm({ username: existingUser, password: '123', confirmPassword: '123' });
        await registerPage.submit();
        const error = await registerPage.getSpecificError('customer.username');
        await expect(error).toContainText('This username already exists.');
    });

    test('TC_REG_05: System Resilience - Optional Phone Field', async () => {
        await registerPage.fillRegistrationForm({
            firstName: 'Optional', lastName: 'Test', address: 'X', city: 'X', state: 'X', zip: '0', ssn: '0',
            username: `opt_${Date.now()}`, password: '1', confirmPassword: '1',
            phone: '' // Omitted
        });
        await registerPage.submit();
        await expect(registerPage.successTitle).toBeVisible();
    });

    test('TC_REG_06: Data Integrity - Alphanumeric SSN Audit', async () => {
        await registerPage.fillRegistrationForm({ ssn: 'ALPHA-SSN-TEST' });
        await registerPage.submit();
        // Pro-style: Check if application allows invalid formats
        await expect(registerPage.page).not.toHaveURL(/.*index.htm/);
    });

    test('TC_REG_07: Boundary Value Analysis - Short Zip Code', async () => {
        await registerPage.fillRegistrationForm({ zip: '12' });
        await registerPage.submit();
        await expect(registerPage.zipInput).toBeVisible(); // Still on form
    });

    test('TC_REG_08: Security Audit - XSS Injection Vulnerability', async () => {
        const xssPayload = '<script>window.proAudit=1</script>';
        await registerPage.fillRegistrationForm({ firstName: xssPayload });
        await registerPage.submit();
        await expect(registerPage.successTitle).toBeVisible();
    });

    test('TC_REG_09: Stress Test - Maximum String Length', async () => {
        await registerPage.fillRegistrationForm({ lastName: 'QA'.repeat(50) });
        await registerPage.submit();
        await expect(registerPage.successTitle).toBeVisible();
    });

    test('TC_REG_10: Navigation Flow - Dashboard Escape', async () => {
        await registerPage.page.click('a[href="/parabank/index.htm"]');
        await expect(registerPage.page).toHaveURL(/.*index.htm/);
    });
});
