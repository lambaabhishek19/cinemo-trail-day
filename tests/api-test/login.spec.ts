import { expect, test } from '@playwright/test';
import Utils from '../../helper/utils';

let utils: Utils;
let userName = 'username@test.de';
let listOfUserName: string[] = [];
test.describe('User Login with correct credentials', async () => {
    test.beforeAll(async () => {
        utils = new Utils();
    });
    test.afterAll(async () => {
        utils = new Utils();
        await utils.deleteUsersData(listOfUserName)
    })
    test('User login with valid email and password', async ({ request }) => {
        const [userName, password] = await utils.createNewUser();
        listOfUserName.push(userName);

        // User login to the application
        const loginResponse = await request.post('http://127.0.0.1:5000/login', {
            form: {
                email: userName,
                password: password
            }
        })
        expect(loginResponse.status()).toBe(200);
        const rawData = await loginResponse.text();
        expect(rawData).toContain('Registered Users'); // Need to verify the expectation
    });
    test('When user try to login with incorrect password', async ({ request }) => {
        const [userName] = await utils.createNewUser();
        listOfUserName.push(userName);

        // User login to the application
        const loginResponse = await request.post('http://127.0.0.1:5000/login', {
            form: {
                email: userName,
                password: '222'
            }
        })
        expect(loginResponse.status()).toBe(200);
        const rawData = await loginResponse.text();
        expect(rawData).toContain('invalid credentials');
    })
    test('When user try to login with empty password', async ({ request }) => {
        const [userName] = await utils.createNewUser();
        listOfUserName.push(userName);

        // User login to the application
        const loginResponse = await request.post('http://127.0.0.1:5000/login', {
            form: {
                email: userName,
                password: ''
            }
        })
        expect(loginResponse.status()).toBe(200);
        const rawData = await loginResponse.text();
        expect(rawData).toContain('invalid credentials');
    })

});