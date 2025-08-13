import { expect, test } from '@playwright/test';
import { usersSchemas } from '../../schemas/userSchema';
import Utils from '../../helper/utils';

let utils: Utils;

test.describe('Test Suite for userApi', () => {
    test('user data schema validation', async ({ request }) => {
        const response = await request.get('http://127.0.0.1:5000/usersapi');
        let rawData = await response.json();
        expect(await response.status()).toBe(200);
        utils = new Utils();
        await utils.validateSchema(usersSchemas, rawData);
    })
    test('test when there are no users', async ({ request }) => {
    })
})