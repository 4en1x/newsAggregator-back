const db = require('../dao/dao');
const request = require('superagent').agent();

async function getArticles(req, res) {
  try {
    const response = await request
      .get(`http://newsapi.org/v2/everything?${req._parsedOriginalUrl.query}&apiKey=b7dd5747a6ab416199e382be3b913d89`)
      .set('Accept', 'application/json');

    let articles = response.body.articles;

    articles = articles.map((article) => {
      article.source = article.source.name;
      article.publishedAt = new Date(article.publishedAt);
      article.user_id = req.user.id;
      return article;
    });

    articles = await db.articles.addArticles(articles, req.user.id);

    res.json(articles);
  } catch (err) {
    res.status(404).end();
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
};
