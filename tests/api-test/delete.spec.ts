import { expect, test } from '@playwright/test';
import Utils from '../../helper/utils';

let utils: Utils;
let userName = 'username@test.de';
let listOfUserName: string[] = [];
test.describe('Delete a existing user', async () => {
    test.beforeAll(async () => {
        utils = new Utils();
    });
    test.afterAll(async () => {
        utils = new Utils();
        await utils.deleteUsersData(listOfUserName)
    })
    test('Succefully delete an existing user', async ({ request }) => {
        const [userName] = await utils.createNewUser();
        const userId = await utils.getUserId(userName)

        const loginResponse = await request.post(`http://127.0.0.1:5000/delete/${userId}`)
        expect(loginResponse.status()).toBe(200);
        const rawData = await loginResponse.json();
        expect(rawData.success).toBe(true);
    });
    test('Delete an non existing user', async ({ request }) => {
        const randomNumber = await utils.randomNumber()
        const loginResponse = await request.post(`http://127.0.0.1:5000/delete/${randomNumber}`)
        expect(loginResponse.status()).toBe(200);
        const rawData = await loginResponse.json();
        expect(rawData.success).toBe(false);
        expect(rawData.error).toBe('No user with that id')
    });
    test('Delete user with invalid Id format', async ({ request }) => {
        const randomNumber = await utils.randomNumber()
        const loginResponse = await request.post(`http://127.0.0.1:5000/delete/abc`)
        expect(loginResponse.status()).toBe(404);
        const rawData = await loginResponse.text();
        expect(rawData).toContain('Not Found')
    });
});
