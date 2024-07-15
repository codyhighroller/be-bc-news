const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const {
	psqlErrorHandler,
	customErrorHandler,
	serverErrorHandler,
} = require("./error-handlers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
	res.status(404).send({ message: "Path not found" });
});

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
