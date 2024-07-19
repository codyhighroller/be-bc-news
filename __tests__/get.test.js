const {
	topicData,
	userData,
	articleData,
	commentData,
} = require("../db/data/test-data/index.js");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const db = require("../db/connection.js");
const endpoints = require("../endpoints.json");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("GET /api/topics", () => {
	test("GET:200 sends an array of topics to the client with slug and description keys", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				expect(body.topics.length).toBe(3);
				body.topics.forEach((item) => {
					expect(typeof item.slug).toBe("string");
					expect(typeof item.description).toBe("string");
				});
			});
	});
});

describe("GET /api/", () => {
	it("GET:200 responds with a json detailing all available endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body.endpoints).toEqual(endpoints);
			});
	});
});

describe("/api/articles/:article_id", () => {
	test("GET:200 sends a single article to the client", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toMatchObject({
					article_id: 1,
					author: "butter_bridge",
					title: "Living in the shadow of a great man",
					body: "I find this existence challenging",
					topic: "mitch",
					votes: 100,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
				expect(new Date(article.created_at)).toBeInstanceOf(Date);
			});
	});

	test("GET:404 responds with an error message when the article does not exist", () => {
		return request(app)
			.get("/api/articles/99999")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("Article not found");
			});
	});

	test("GET:400 responds with an error message for an invalid article_id", () => {
		return request(app)
			.get("/api/articles/not-a-valid-id")
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid input type");
			});
	});
});

describe("GET /api/articles", () => {
	test("GET:200 articles have the correct properties and data types respectively", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles[0]).toEqual(
					expect.objectContaining({
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						article_id: expect.any(Number),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(Number),
					})
				);
			});
	});
	test("GET:200 sends an array of all articles with the correct properties", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				expect(Array.isArray(body.articles)).toBe(true);
				expect(body.articles.length).toBeGreaterThan(0);
				body.articles.forEach((article) => {
					expect(article).toMatchObject({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(Number),
					});
					expect(article.body).toBeUndefined();
				});
			});
	});

	test("GET:200 articles are sorted by date in descending order as default", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
});

describe("GET /api/articles (with query parameters)", () => {
	test("GET:200 articles are sorted by votes in ascending order when specified", () => {
		return request(app)
			.get("/api/articles?sort_by=votes&order=asc")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("votes", {
					ascending: true,
				});
			});
	});

	test("GET:200 articles are sorted by comment_count in descending order when specified", () => {
		return request(app)
			.get("/api/articles?sort_by=comment_count&order=desc")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("comment_count", {
					descending: true,
				});
			});
	});

	test("GET:200 articles are sorted by author alphabetically when specified", () => {
		return request(app)
			.get("/api/articles?sort_by=author&order=asc")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("author", {
					ascending: true,
				});
			});
	});

	test("GET:400 responds with an error for an invalid sort_by query", () => {
		return request(app)
			.get("/api/articles?sort_by=invalid_column")
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid sort query");
			});
	});

	test("GET:400 responds with an error for an invalid order query", () => {
		return request(app)
			.get("/api/articles?sort_by=votes&order=invalid_order")
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid order query");
			});
	});

	test("GET:200 articles are sorted by title in descending order when only sort_by is specified", () => {
		return request(app)
			.get("/api/articles?sort_by=title")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("title", {
					descending: true,
				});
			});
	});

	test("GET:200 articles are sorted by created_at in ascending order when only order is specified", () => {
		return request(app)
			.get("/api/articles?order=asc")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("created_at", {
					ascending: true,
				});
			});
	});
});

describe("GET /api/articles (topic filtering)", () => {
	test("GET:200 articles accept filtering by topic", () => {
		return request(app)
			.get("/api/articles?topic=mitch")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(12);
				articles.forEach((article) => {
					expect(article).toHaveProperty("topic", "mitch");
				});
			});
	});

	test("GET:200 responds with empty array if topic does not exist", () => {
		return request(app)
			.get("/api/articles?topic=invalid")
			.expect(200)
			.then(({ body: { articles } }) => expect(articles).toEqual([]));
	});

	test("GET:200 articles can be filtered by topic and sorted", () => {
		return request(app)
			.get("/api/articles?topic=mitch&sort_by=votes&order=desc")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBeGreaterThan(0);
				expect(articles).toBeSortedBy("votes", { descending: true });
				articles.forEach((article) => {
					expect(article).toHaveProperty("topic", "mitch");
				});
			});
	});
});

describe("GET /api/articles/:article_id/comments", () => {
	test("GET 200: responds with an array of comments for the given article_id with the correct properties", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then(({ body }) => {
				expect(Array.isArray(body.comments)).toBe(true);
				expect(body.comments.length).toBeGreaterThan(0);
				body.comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						article_id: 1,
					});
				});
				expect(body.comments).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});

	test("GET 404: responds with appropriate error message when article doesn't exist", () => {
		return request(app)
			.get("/api/articles/999/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("Article not found");
			});
	});

	test("GET 400: responds with appropriate error message for invalid article_id", () => {
		return request(app)
			.get("/api/articles/not-an-id/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid input type");
			});
	});
});

describe("GET /api/users", () => {
	test("GET:200 sends an array of objects to the client with correct keys", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				expect(Array.isArray(body.users)).toBe(true);
				expect(body.users.length).toBe(4);
				body.users.forEach((user) => {
					expect(user).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					});
				});
			});
	});
});
