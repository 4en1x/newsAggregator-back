const Router = require('express').Router;

const users = require('./routes/users.route');

function init(app) {
  const restRoute = new Router();

  restRoute.use('/users', users);

  restRoute.use((req, res) => {
    res.status(404).end();
  });

  app.use('/', restRoute);
}

module.exports = {
  init,
};
