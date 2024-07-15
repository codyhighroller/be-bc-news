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
const format = require("pg-format");
const endpoints = require("../endpoints.json");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("/api/topics", () => {
	test("GET:200 sends an array of topics to the client with slug and description keys", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then((response) => {
				expect(response.body.topics.length).toBe(3);
				response.body.topics.forEach((item) => {
					expect(typeof item.slug).toBe("string");
					expect(typeof item.description).toBe("string");
				});
			});
	});
});

describe("/api/topics", () => {
	describe("GET /api", () => {
		it("responds with a json detailing all available endpoints", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then(({ body }) => {
					expect(body.endpoints).toEqual(endpoints);
				});
		});
	});
});

describe("/api/articles/:article_id", () => {
	test("GET:200 sends a single article to the client", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then((response) => {
				const { article } = response.body;
				expect(article.article_id).toBe(1);
				expect(article.author).toBe("butter_bridge");
				expect(article.title).toBe(
					"Living in the shadow of a great man"
				);
				expect(article.body).toBe("I find this existence challenging");
				expect(article.topic).toBe("mitch");
				expect(new Date(article.created_at)).toBeInstanceOf(Date);
				expect(article.votes).toBe(100);
				expect(article.article_img_url).toBe(
					"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
				);
			});
	});

	test("GET:404 responds with an error message when the article does not exist", () => {
		return request(app)
			.get("/api/articles/99999")
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe("Article does not exist");
			});
	});

	test("GET:400 responds with an error message for an invalid article_id", () => {
		return request(app)
			.get("/api/articles/not-a-valid-id")
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe("Invalid id type");
			});
	});
});

describe("error handling", () => {
	test("GET:404 responds with an appropriate error message when path not found", () => {
		return request(app)
			.get("/api/not-a-route")
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("Path not found");
			});
	});
});

describe("isolated error handling: empty topics table", () => {
	test("GET:404 'No topics found' error when no topics exist", () => {
		// This test simulates an empty topics table
		return db
			.query(`DROP TABLE IF EXISTS comments;`)
			.then(() => db.query(`DROP TABLE IF EXISTS articles;`))
			.then(() => db.query(`DROP TABLE IF EXISTS users;`))
			.then(() => db.query(`DROP TABLE IF EXISTS topics;`))
			.then(() => {
				return db.query(`
			CREATE TABLE topics (
			  slug VARCHAR PRIMARY KEY,
			  description VARCHAR
			);`);
			})
			.then(() => {
				return request(app).get("/api/topics").expect(404);
			})
			.then(({ body }) => {
				expect(body.message).toBe("No topics found");
			});
	});
});
