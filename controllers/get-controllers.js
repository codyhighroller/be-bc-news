const {
	selectTopics,
	selectArticleById,
	selectAllArticles,
	selectCommentsByArticleId,
} = require("../models/get-models");
const { checkArticleExists } = require("../db/seeds/utils");

exports.getTopics = (req, res, next) => {
	selectTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAllArticles = (req, res, next) => {
	selectAllArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	selectCommentsByArticleId(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postTeam = (req, res, next) => {
	const newTeam = req.body;
	insertTeam(newTeam)
		.then((team) => {
			res.status(201).send({ team });
		})
		.catch((err) => {
			console.log(err, "<<<<postTeam Err in the cont");
			next(err);
		});
};
