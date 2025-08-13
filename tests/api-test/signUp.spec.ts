import { expect, test } from '@playwright/test';
import Utils from '../../helper/utils';

let utils: Utils;
let userName = 'username@test.de';
let listOfUserName: string[] = [];
test.describe('Signup endpoint with positive scenarios', async () => {
    test.beforeAll(async () => {
        utils = new Utils();
    });
    test.afterAll(async () => {
        utils = new Utils();
        await utils.deleteUsersData(listOfUserName)
    })
    test('User signup with valid email and password', async ({ request }) => {
        const randomNumber = await utils.randomNumber();
        userName = `user${randomNumber}@test.de`;
        const response = await request.post('http://127.0.0.1:5000/signup', {
            form: {
                email: userName,
                password: '123'
            }
        })
        expect(response.status()).toBe(200)
        const rawData = await response.text();
        expect(rawData).toBe('User signed up successfully! <br>You can now <a href=/>Log in</a>') // expection is different
        listOfUserName.push(userName);
    });
    test('When user already exist', async ({ request }) => {
        //create the user
        const [userName, password] = await utils.createNewUser();
        listOfUserName.push(userName);

        //try to duplicate it

        const responseRaw = await request.post('http://127.0.0.1:5000/signup', {
            form: {
                email: userName,
                password: password
            }
        })
        expect(responseRaw.status()).toBe(200)
        const rawData = await responseRaw.text();
        expect(rawData).toContain('User with that email already exists') // without .
    })
});
test.describe('Signup endpoint with negative scenarios', async () => {
    test('User try to signup without password', async ({ request }) => {
        const response = await request.post('http://127.0.0.1:5000/signup', {
            form: {
                email: userName
            }
        })
        expect(response.status()).toBe(500);
    });
    test('User try to signup without email', async ({ request }) => {
        const response = await request.post('http://127.0.0.1:5000/signup', {
            form: {
                password: '123',
            }
        })
        expect(response.status()).toBe(500);
    });
    // Test should fail, as user is not allowed to signup witout email format with UI
    test('User try to signup with invalid email', async ({ request }) => {
        const response = await request.post('http://127.0.0.1:5000/signup', {
            form: {
                email: 'not-valid-email',
                password: '123'
            }
        })
        expect(response.status()).toBe(200); // should fail here
    });
    // Test should fail, as user is not allowed to signup with empty password with UI
    test('User try to signup with empty password', async ({ request }) => {
        const response = await request.post('http://127.0.0.1:5000/signup', {
            form: {
                email: 'test',
                password: ''
            }
        })
        expect(response.status()).toBe(200); // should fail here
    });
    test('User try to signup with invalid content type', async ({ request }) => {
        const response = await request.post('http://127.0.0.1:5000/signup', {
            form: {
                email: 'test',
                password: ''
            },
            headers: { 'Content-Type': 'application/json' }
        })
        expect(response.status()).toBe(500);
    });
})