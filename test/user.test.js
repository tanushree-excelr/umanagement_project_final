const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = require("../src/models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "umanagement" });
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User API", () => {
  it("should create a user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ name: "Tanushree", email: "tanushree@example.com", username: "tanushree1" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.name).toBe("Tanushree");
  });

  it("should fetch all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
  });
});
