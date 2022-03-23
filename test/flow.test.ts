import { agent as request } from 'supertest';
import { userInfo } from "os";

beforeEach(() => {
  jest.resetModules();
});

let tag = "";

let userInput = {
  email: "test@example.com",
  name: "Jane Doe",
  address: "3232 AV23",
  password: "Password123"
};

const url = "https://fvs1m6rc69.execute-api.us-east-1.amazonaws.com/prod";

//BasicSuccess - All data rules correct
describe('API-USERS-A', () => {

  test('001 - Create a new user and check with get user', async () => {


    const responsePost = await request(url).post('/v1/signup').send(userInput);
    //Then the status code returned from server is 201
    expect(responsePost.status).toStrictEqual(201);
    // No errors
    expect(responsePost.error).toEqual(false);
 


  });

})
