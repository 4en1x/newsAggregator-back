const db = require('../dao/dao');
// const request = require('superagent').agent();

async function getArticles(req, res) {
  try {
    const articles = await db.articles.findArticles(req.user.id, req.query.page);

    res.json(articles);
  } catch (err) {
    console.log(err);
    res.status(404).end();
  }
}

async function deleteArticle(req, res) {
  try {
    await db.articles.deleteOne(req.params.id);

    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}

async function getLikedArticles(req, res) {
  try {
    const articles = await db.articles.findLiked(req.user.id, req.params.page);

    res.json(articles);
  } catch (err) {
    res.status(404).end();
  }
}

async function getArticle(req, res) {
  try {
    const article = await db.articles.findOne(req.params.id);
    res.json(article);
  } catch (err) {
    res.status(404).end();
  }
}

async function likeArticle(req, res) {
  try {
    await db.articles.likeArticle(req.params.id);
    res.status(200).end();
  } catch (err) {
    res.status(404).end();
  }
}

module.exports = {
  getArticles,
  getArticle,
  likeArticle,
  getLikedArticles,
  deleteArticle,
};
