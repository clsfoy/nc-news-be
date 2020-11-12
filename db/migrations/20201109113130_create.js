exports.up = function (knex) {
  return knex.schema.createTable("articles", (articleTable) => {
    articleTable.increments("article_id").primary();
    articleTable.string("title");
    articleTable.text("body");
    articleTable.integer("votes").defaultTo(0);
    articleTable.string("topic").references("topics.slug");
    articleTable.text("author").references("users.username");
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("articles");
};
