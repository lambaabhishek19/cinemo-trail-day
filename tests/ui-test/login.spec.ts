import { test, expect, type Page } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import HomePage from '../../pages/homePage';
import Utils from '../../helper/utils';

let utils: Utils;
let listOfUserName: string[] = [];
let loginpage: LoginPage;
let homePage: HomePage;

test.describe('User login to application', () => {
    test.beforeAll(async () => {
        utils = new Utils();
       
    });
    test.afterAll(async () => {
        utils = new Utils();
        await utils.deleteUsersData(listOfUserName)
    })
    test('user succfully login to application', async({page}) =>{
        await page.goto('http://127.0.0.1:5000/');
          const [userName, password] = await utils.createNewUser();
        listOfUserName.push(userName);
         loginpage = new LoginPage(page);
        await  loginpage.userLogin(userName,password);
        homePage = new HomePage(page);
        await homePage.expectUserIsLoggedIn();
       
        
    });
     test('user sign up to the application', async({page}) =>{
        const randomNumber = await utils.randomNumber();
        const userName = `user${randomNumber}@test.de`;
        await page.goto('http://127.0.0.1:5000/');
         loginpage = new LoginPage(page);
         await loginpage.openSignUpPopUp();
        await  loginpage.userSignUp(userName,'123');
        await loginpage.expectUserLoggedIn();
        listOfUserName.push(userName);
        
    })

});
