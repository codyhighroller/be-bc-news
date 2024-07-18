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

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("PATCH /api/articles/:article_id", () => {
	test("PATCH 200: updates votes and responds with the updated article", () => {
		const updateVotes = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/1")
			.send(updateVotes)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					article_id: 1,
					title: "Living in the shadow of a great man",
					topic: "mitch",
					author: "butter_bridge",
					body: "I find this existence challenging",
					created_at: expect.any(String),
					votes: 101,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});

	test("PATCH 200: correctly decrements votes when passed a negative value", () => {
		const updateVotes = { inc_votes: -50 };
		return request(app)
			.patch("/api/articles/1")
			.send(updateVotes)
			.expect(200)
			.then(({ body }) => {
				expect(body.article.votes).toBe(50);
			});
	});

	test("PATCH 404: responds with an error message when the article does not exist", () => {
		const updateVotes = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/99999")
			.send(updateVotes)
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("Article not found");
			});
	});

	test("PATCH 400: responds with an error message for an invalid article_id", () => {
		const updateVotes = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/not-a-valid-id")
			.send(updateVotes)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid input type");
			});
	});

	test("PATCH 400: responds with an error message when inc_votes is missing", () => {
		return request(app)
			.patch("/api/articles/1")
			.send({})
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Missing required fields");
			});
	});

	test("PATCH 400: responds with an error message when inc_votes is not a number", () => {
		const updateVotes = { inc_votes: "not a number" };
		return request(app)
			.patch("/api/articles/1")
			.send(updateVotes)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid input type");
			});
	});
});
