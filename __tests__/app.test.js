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

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("/api/topics", () => {
	test("GET:200 sends an array of topics to the client", () => {
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

describe("Isolated error handling", () => {
	test("GET:404 No topics found error when no topics exist", () => {
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
