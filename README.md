Northcoders News API

Project Summary
This project is a RESTful API for a news application, similar to Reddit. It provides various endpoints for retrieving articles, comments, and user information, as well as posting comments and voting on articles. The API is built with Node.js and Express, using a PostgreSQL database for data storage.

Hosted Version
The API is hosted on Render and can be accessed at: https://be-bc-news.onrender.com/api
Installation and Setup

Prerequisites

Node.js (v14.0.0 or later)
PostgreSQL (v12.0 or later)

Steps to Run Locally

Clone the repository:
git clone https://github.com/lb-commits/be-nc-news.git
cd be-nc-news

Install dependencies:
npm install

Set up environment variables:
Create two files in the root directory: .env.development and .env.test
In each file, add the following line, replacing your_database_name with the appropriate database name:
PGDATABASE=your_database_name

Setup the databases:
npm run setup-dbs

Seed the development database:
npm run seed

Run the tests:
npm test

Start the server:
npm start

Available Endpoints
For a full list of available endpoints and their descriptions, please refer to the endpoints.json file in the root of the project.
Some key endpoints include:

GET /api/topics
GET /api/articles
GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
PATCH /api/articles/:article_id
DELETE /api/comments/:comment_id
GET /api/users

Running Tests
To run the test suite, use the command:
npm test

This will run all tests using Jest.

Seeding the Production Database
If you need to seed the production database, use the following command:
npm run seed-prod

Note: Make sure you have set up the appropriate environment variables for your production database before running this command.

Contributing
If you'd like to contribute to this project, please fork the repository and create a pull request with your changes.
