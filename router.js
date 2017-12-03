const Router = require('express').Router;

const users = require('./routes/users.route');
const articles = require('./routes/articles.route');

function init(app) {
  const restRoute = new Router();

  restRoute.use('/users', users);
  restRoute.use('/articles', articles);

  restRoute.use((req, res) => {
    res.status(404).end();
  });

  app.use('/', restRoute);
}

module.exports = {
  init,
};
