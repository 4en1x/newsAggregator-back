const UsersDAO = require('./impl/users.dao');
const ArticlesDAO = require('./impl/articles.dao');

module.exports = {
  users: UsersDAO.instance,
  articles: ArticlesDAO.instance,
};
