import { expect, request } from '@playwright/test';
import { ZodType } from 'zod';
class Utils {
  async randomNumber() {
    return (Math.floor(Math.random() * 999999) + 1).toString();
  }
  async deleteUsersData(userlist: string[]) {
    const api = await request.newContext();
    for (let i = 0; i < userlist.length; i++) {
      const userId = await this.getUserId(userlist[i]);
      const response = await api.post(`http://127.0.0.1:5000/delete/${userId}`);
      expect(await response.status()).toBe(200)
    }
  }
  async getUserId(userEmail) {
    const api = await request.newContext();
    const response = await api.get('http://127.0.0.1:5000/usersapi')
    expect(await response.status()).toBe(200)
    const users = await response.json();
    const targetUser = users.find(user => user.email === userEmail);
    if (!targetUser) {
      throw new Error(`User with email ${userEmail} not found`);
    }
    return targetUser.id;
  }
  async createNewUser() {
    const api = await request.newContext();
    const randomNumber = await this.randomNumber();
    let userName = `user${randomNumber}@test.de`;
    let password = '123'
    const response = await api.post('http://127.0.0.1:5000/signup', {
      form: {
        email: userName,
        password: password
      }
    })
    expect(await response.status()).toBe(200);
    console.log('username is ' + userName);

    return [userName, password];
  }
  async validateSchema<T>(schema: ZodType<T>, data: unknown) {
    const result = await schema.safeParse(data);
    if (!result.success) {
      throw new Error(`API response validation failed:\n${result.error.message}`);
    }
    return result.data;
  }
}

export default Utils;
