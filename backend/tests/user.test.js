// backend/tests/user.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server"); 

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Auth Tests", () => {


  it("should login user and return token", async () => {
    await request(app).post("/api/auth/register").send({
      username: "testuser2",
      password: "testpass2",
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "testuser2",
      password: "testpass2",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
