const app = require("../app.js");
const request = require("supertest");
const connection = require("../db/connection");

describe("/api", () => {
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

    test("POST responds with status 201 and new topic object", () => {
      return request(app)
        .post("/api/topics")
        .send({
          description: "records",
          slug: "take all my money!",
        })
        .expect(201)
        .then(({ body: { createdTopic } }) => {
          expect(createdTopic[0]).toHaveProperty("description");
          expect(createdTopic[0].slug).toBe("take all my money!");
        });
    });

    test("INVALID METHOD responds with status 405", () => {
      const methods = ["delete", "patch"];
      const requestPromises = methods.map((method) => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe("Oops...invalid method");
          });
      });
      return Promise.all(requestPromises);
    });
  });

  describe("api/users/", () => {
    test("INVALID METHODS respond with status 405", () => {
      const methods = ["delete", "patch"];
      const requestPromises = methods.map((method) => {
        return request(app)
          [method]("/api/users")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe("Oops...invalid method");
          });
      });
      return Promise.all(requestPromises);
    });

    describe("/api/users/:username", () => {
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
      test("GET responds with 404 not found when passed a non-existing username", () => {
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
  });

  describe("/api/articles", () => {
    describe("/api/articles/:article_id", () => {
      test.only("GET responds with article object and status 200", () => {
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
                  comment_count: "8",
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
    });

    describe("/api/articles/:article_id/comments", () => {
      test("GET responds with 200 and comments for the specified article", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((response) => {
            expect(response.body.comments.length).toBe(8);
          });
      });

      test.only("GET responds with status 200 sorted by comment_id asc", () => {
        return request(app)
          .get("/api/articles/3/comments?sort_by=comment_id&order=asc")
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toBeSortedBy("comment_id", "asc");
          });
      });
      test("POST responds with status 201 and new comment", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            username: "tickle122",
            body: "this is my new comment!!!",
          })
          .expect(201)
          .then((response) => {
            expect(response.body).toEqual({
              newComment: [
                {
                  article_id: 2,
                  author: "tickle122",
                  body: "this is my new comment!!!",
                  comment_id: expect.any(Number),
                  created_at: expect.any(String),
                  votes: 0,
                },
              ],
            });
          });
      });
      test("POST responds with status 404 when missing username key", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({
            username: "",
            body: "whoooops",
          })
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({
              status: 404,
              msg: "Please provide a registered username",
            });
          });
      });
    });

    describe("/api/articles", () => {
      test("GET responds with status 200 and array of article objects sorted by date", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Array.isArray(articles)).toBe(true);
            const allArticlesHaveCommentCount = articles.every((article) => {
              return article.hasOwnProperty("comment_count");
            });
            expect(allArticlesHaveCommentCount).toBe(true);
          });
      });

      test("GET responds with status 200 and sorted articles by votes descending", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", {
              descending: true,
              coerce: true,
            });
          });
      });
      test("GET responds with status 200 and sorted articles by article_id ascending", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("article_id", "asc");
          });
      });

      test("GET responds with status 200 and articles filtered by author", () => {
        return request(app)
          .get("/api/articles?author=jessjelly")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].author).toBe("jessjelly");
            expect(articles.length).toBe(7);
          });
      });

      test("GET responds with status 200 and articles filtered by topic", () => {
        return request(app)
          .get("/api/articles?topic=football")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].topic).toBe("football");
            expect(articles.length).toBe(12);
          });
      });

      test("GET responds with status 400 when sort query is invalid", () => {
        return request(app)
          .get("/api/articles?sort_by=notAColumn")
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({
              status: 400,
              msg: "Bad Request",
            });
          });
      });

      // GOING TO COME BACK TO THIS
      // test.only("POST responds with status 201 and new article object", () => {
      //   return request(app)
      //     .post("/api/articles")
      //     .send({
      //       title: "new title",
      //       body: "this is the body...",
      //       votes: 0,
      //     })
      //     .expect(201)
      //     .then((response) => {});
      // });
    });
  });

  describe("/api/comments", () => {
    describe("/api/comments/:comment_id", () => {
      test("PATCH responds with status 201 and comment updated vote count", () => {
        return request(app)
          .patch("/api/comments/4")
          .send({ inc_votes: 4 })
          .expect(201)
          .then(({ body: { updatedComment } }) => {
            expect(updatedComment[0].votes).toBe(8);
          });
      });

      test("DELETE responds with status 204 and deletes comment by comment_id", () => {
        return request(app)
          .delete("/api/comments/3")
          .expect(204)
          .then(() => {
            return connection
              .select("*")
              .from("comments")
              .where("comment_id", "=", "3");
          })
          .then((comments) => {
            expect(comments.length).toBe(0);
          });
      });

      test("DELETE responds with status 404 when given a non-existing comment ID", () => {
        return request(app)
          .delete("/api/comments/439680384")
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({
              status: 404,
              msg: "Comment not found - nothing to delete",
            });
          });
      });
    });
    test.only("DELETE responds with status 404 when ID is not a number", () => {
      return request(app)
        .delete("/api/comments/notanumber")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            status: 400,
            msg: "Bad Request",
          });
        });
    });
  });

  describe("/api/invalidroute", () => {
    test("GET responds with status 400 when given an invalid route", () => {
      return request(app)
        .get("/api/invalidroute")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            status: 404,
            msg: "Invalid Path - please see /api for available paths",
          });
        });
    });
  });
  //   describe('/api', () => {
  //     test('GET responds with JSON object describing all the available endpoints', () => {

  //   })
  // })
});
