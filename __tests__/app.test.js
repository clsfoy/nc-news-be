process.env.NODE_ENV = "test";
const app = require("../app.js");
const request = require("supertest");
const connection = require("../db/connection");
const { TestScheduler } = require("jest");

describe.only("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  afterAll(() => {
    return connection.destroy();
  });

  describe("/api/topics", () => {
    test("GET responds with array of topics objects and status 200", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.topics.length).toBe(3);
          expect(response.body.topics[0]).toHaveProperty("description");
          expect(response.body.topics[0]).toHaveProperty("slug");
        });
    });
  });
});
