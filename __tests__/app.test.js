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
  //API
  test("GET responds with status 200 and all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { apiEndPoints } }) => {
        const totalEndPoints = Object.keys(apiEndPoints).length;
        expect(totalEndPoints).toBe(14);
        expect(apiEndPoints).toEqual(expect.any(Object));
      });
  });
  //TOPICS
  describe("/api/topics", () => {
    test("GET responds with array of topics objects and status 200", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          const topicsHaveDescription = topics.every((topic) => {
            return topic.hasOwnProperty("description");
          });
          const topicsHaveSlug = topics.every((topic) => {
            return topic.hasOwnProperty("slug");
          });
          expect(topicsHaveDescription).toBe(true);
          expect(topicsHaveSlug).toBe(true);
          expect(topics.length).toBe(3);
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
  //USERS
  describe("api/users", () => {
    test("DELETE repsonds with 405 invalid method", () => {
      return request(app)
        .delete("/api/users/weegembump")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Oops...invalid method");
        });
    });
  });

  describe("/api/users/:username", () => {
    test("GET responds with a specific user object and status 200", () => {
      return request(app)
        .get("/api/users/tickle122")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user[0].name).toBe("Tom Tickle");
          expect(user[0]).toHaveProperty("avatar_url");
          expect(user[0]).toHaveProperty("username");
          expect(user[0]).toHaveProperty("name");
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

    test("PATCH responds with status 200 and updated user info - username cannot be changed", () => {
      return request(app)
        .patch("/api/users/tickle122")
        .send({
          newName: "Mr Plant",
          newAvatar:
            "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
        })
        .expect(201)
        .then(() => {
          return connection("users")
            .where("name", "=", "Mr Plant")
            .then((user) => {
              expect(user[0].name).toBe("Mr Plant");
              expect(user[0].username).toBe("tickle122");
            });
        });
    });
  });

  //ARTICLES
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
          expect(articles.length).toBe(10);
          expect(allArticlesHaveCommentCount).toBe(true);
        });
    });

    test("GET responds with status 200 and array of article objects from page 3 limited to 5", () => {
      return request(app)
        .get("/api/articles?limit=5&p=1&sort_by=article_id&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
          const allArticlesHaveCommentCount = articles.every((article) => {
            return article.hasOwnProperty("comment_count");
          });
          expect(allArticlesHaveCommentCount).toBe(true);
          expect(articles.length).toBe(5);
          expect(articles[0].article_id).toBe(1);
          expect(articles[1].article_id).toBe(2);
          expect(articles[2].article_id).toBe(3);
          expect(articles[3].article_id).toBe(4);
          expect(articles[4].article_id).toBe(5);
        });
    });

    test("GET responds with status 200 and array of articles filtered by author", () => {
      return request(app)
        .get("/api/articles?author=grumpy19")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.articles)).toBe(true);
          expect(response.body.articles[0].author).toBe("grumpy19");
          expect(response.body.total_count).toBe("6");
          expect(response.body.articles.length).toBe(6);
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
          expect(articles[0].article_id).toBe(1);
        });
    });

    test("GET responds with status 200 and articles filtered by author", () => {
      return request(app)
        .get("/api/articles?author=jessjelly")
        .expect(200)
        .then(({ body: { articles } }) => {
          const allArticlesByAuthor = articles.every((article) => {
            return article.author === "jessjelly";
          });
          expect(allArticlesByAuthor).toBe(true);
          expect(articles.length).toBe(7);
        });
    });

    test("GET responds with status 200 and articles filtered by topic", () => {
      return request(app)
        .get("/api/articles?topic=football")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].topic).toBe("football");
          expect(articles.length).toBe(10);
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

    test("POST responds with status 201 and new article object", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "liverpools injury problems",
          body: "it's all going downhill!",
          topic: "football",
          author: "tickle122",
          votes: 0,
        })
        .expect(201)
        .then(({ body: { newArticle } }) => {
          const articleId = newArticle[0].article_id;
          return connection
            .select("*")
            .from("articles")
            .where("articles.article_id", "=", articleId);
        })
        .then((article) => {
          expect(article[0].body).toBe("it's all going downhill!");
          expect(article[0].author).toBe("tickle122");
        });
    });

    describe("/api/articles/:article_id", () => {
      test("GET responds with article object and status 200", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
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
            expect(body).toEqual(expected);
          });
      });
      test("GET responds with 404 not found when passed a non-existing article ID", () => {
        return request(app)
          .get("/api/articles/346389")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({
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
          .then(({ body: { updatedArticle } }) => {
            expect(updatedArticle[0].votes).toBe(1);
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 5 })
              .then(({ body: { updatedArticle } }) => {
                expect(updatedArticle[0].votes).toBe(6);
                return request(app)
                  .patch("/api/articles/1")
                  .send({ inc_votes: -1 })
                  .expect(201)
                  .then(({ body: { updatedArticle } }) => {
                    expect(updatedArticle[0].votes).toBe(5);
                  });
              });
          });
      });
      test("PATCH responds with 404 not found when updating with a non-existing article ID", () => {
        return request(app)
          .patch("/api/articles/3573737")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({
              status: 404,
              msg: "Article not found - update unsuccessful",
            });
          });
      });

      test("DELETE responds with 204 and deletes article based on article ID", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(204)
          .then(() => {
            return connection
              .select("*")
              .from("articles")
              .where("article_id", "=", "1")
              .returning("*");
          })
          .then((article) => {
            expect(article.length).toBe(0);
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
          .then(({ body }) => {
            expect(body).toEqual({
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
          .then(({ body: { comments } }) => {
            const commentHasBody = comments.every((comment) => {
              return comment.hasOwnProperty("body");
            });
            expect(commentHasBody).toBe(true);
            expect(comments.length).toBe(8);
          });
      });

      test("GET responds with status 200 sorted by comment_id asc", () => {
        return request(app)
          .get("/api/articles/3/comments?sort_by=comment_id&order=asc&limit=3")
          .expect(200)
          .then(({ body: { comments } }) => {
            const commentHasBody = comments.every((comment) => {
              return comment.hasOwnProperty("body");
            });
            expect(commentHasBody).toBe(true);
            expect(comments).toBeSortedBy("comment_id", "asc");
            expect(comments.length).toBe(3);
          });
      });

      test("GET responds with 200 and comments starting at specified page number", () => {
        return request(app)
          .get(
            "/api/articles/1/comments?limit=3&p=2&sort_by=comment_id&order=asc"
          )
          .expect(200)
          .then(({ body: { comments } }) => {
            const commentHasBody = comments.every((comment) => {
              return comment.hasOwnProperty("body");
            });
            expect(commentHasBody).toBe(true);
            expect(comments.length).toBe(3);
          });
      });

      test("GET responds with status 400 when article_id is not a number", () => {
        return request(app)
          .get("/api/articles/notanumber/comments")
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({
              status: 400,
              msg: "Bad Request",
            });
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
            const { comment_id } = response.body.newComment[0];
            return connection
              .select("*")
              .from("comments")
              .where("comment_id", "=", comment_id);
          })
          .then((comment) => {
            expect(comment[0].body).toBe("this is my new comment!!!");
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

    describe("/api/articles", () => {});
  });
  //COMMENTS
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
    test("DELETE responds with status 404 when ID is not a number", () => {
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
});
