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

describe("DELETE /api/comments/:comment_id", () => {
	test("DELETE:204 delete comment by id", () => {
		return request(app).delete("/api/comments/2").expect(204);
	});

	test("DELETE:404 returns appropriate error comment does not exist", () => {
		return request(app)
			.delete("/api/comments/50")
			.expect(404)
			.then(({ body: { message } }) =>
				expect(message).toBe("Comment not found")
			);
	});

	test("DELETE:400 returns appropriate error for invalid comment id", () => {
		return request(app)
			.delete("/api/comments/not-a-number")
			.expect(400)
			.then(({ body: { message } }) =>
				expect(message).toBe("Invalid input type")
			);
	});
});
