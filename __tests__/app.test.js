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
  describe("api/users/:username", () => {
    test("GET responds with a specific user object and status 200", () => {
      return request(app)
        .get("/api/users/tickle122")
        .expect(200)
        .then((response) => {
          expect(response.body.user[0].name).toBe("Tom Tickle");
          expect(response.body.user[0]).toHaveProperty("avatar_url");
          expect(response.body.user[0]).toHaveProperty("username");
          expect(response.body.user[0]).toHaveProperty("name");
        });
    });
    test.only("GET responds with 404 not found when passed a non-existing username", () => {
      return request(app)
        .get("/api/users/notAUser")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            status: 404,
            msg: "User not found",
          });
        });
    });
  });

  describe("/api/articles", () => {
    // NEED TO ADD TEST FOR COMMENT COUNT
    test("GET responds with article object and status 200", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const expected = {
            article: [
              {
                article_id: 1,
                title: "Running a Node App",
                body:
                  "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
                votes: 0,
                topic: "coding",
                author: "jessjelly",
                created_at: "2016-08-18T12:07:52.389Z",
              },
            ],
          };
          expect(response.body).toEqual(expected);
        });
    });
    test("GET responds with 404 not found when passed a non-existing article ID", () => {
      return request(app)
        .get("/api/articles/346389")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            status: 404,
            msg: "Article not found",
          });
        });
    });
    test("PATCH responds with 201 and updates the vote number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(201)
        .then((response) => {
          expect(response.body.updatedArticle[0].votes).toBe(1);
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 5 })
            .then((response) => {
              expect(response.body.updatedArticle[0].votes).toBe(6);
              return request(app)
                .patch("/api/articles/1")
                .send({ inc_votes: -1 })
                .expect(201)
                .then((response) => {
                  expect(response.body.updatedArticle[0].votes).toBe(5);
                });
            });
        });
    });
    test("PATCH responds with 404 not found when updating with a non-existing article ID", () => {
      return request(app)
        .patch("/api/articles/3573737")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            status: 404,
            msg: "Article not found - update unsuccessful",
          });
        });
    });

    test("DELETE responds with 204 and deletes article based on article ID", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then((response) => {
          console.log(response.status);
        });
    });

    test("DELETE removes any comments with corresponding article ID", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then(() => {
          return connection
            .select("*")
            .from("comments")
            .where("article_id", "=", "1");
        })
        .then((comments) => {
          expect(comments.length).toBe(0);
        });
    });

    test("DELETE responds with 404 when deleting comment with non-existing article ID", () => {
      return request(app)
        .delete("/api/articles/537537")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            status: 404,
            msg: "Article not found - nothing to delete",
          });
        });
    });

    test.only("POST responds with status 201 and new comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "tickle122",
          body: "this is my new comment!!!",
        })
        .expect(201)
        .then((response) => {
          console.log(response);
        });
    });
  });
});
