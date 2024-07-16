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

describe("POST /api/articles/:article_id/comments", () => {
	test("201: adds a comment to an article and responds with the posted comment", () => {
		const newComment = {
			username: "butter_bridge",
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					comment_id: expect.any(Number),
					body: "This is a test comment",
					article_id: 1,
					author: "butter_bridge",
					votes: 0,
					created_at: expect.any(String),
				});
			});
	});

	test("404: responds with an error when the article does not exist", () => {
		const newComment = {
			username: "butter_bridge",
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/99999/comments")
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("Article not found");
			});
	});

	test("400: responds with an error for invalid article_id", () => {
		const newComment = {
			username: "butter_bridge",
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/not-a-valid-id/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Invalid id type");
			});
	});

	test("400: responds with an error when required fields are missing", () => {
		const invalidComment = {
			username: "butter_bridge",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(invalidComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toBe("Missing required fields");
			});
	});

	test("404: responds with an error when the username does not exist", () => {
		const newComment = {
			username: "non_existent_user",
			body: "This is a test comment",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.message).toBe("User not found");
			});
	});
});
