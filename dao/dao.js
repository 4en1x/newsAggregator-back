const UsersDAO = require('./impl/users.dao');

module.exports = {
  users: UsersDAO.instance,
};
