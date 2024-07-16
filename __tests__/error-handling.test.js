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

afterAll(() => db.end());

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
