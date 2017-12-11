const service = require('../services/auth.service');
const db = require('../dao/dao');

async function login(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      throw new Error('400');
    }

    const user = await service.promisifiedAuthenticate(req, res);

    if (!user) {
      res.status(401).end();
      return;
    }

    req.logIn(user, (error) => {
      if (error) {
        res.status(401).end();
        return;
      }

      res.json({ nickname: user.nickname, email: user.email, language: user.language });
    });
  } catch (err) {
    if (err.message === '401') {
      res.status(401).end();
      return;
    }

    if (err.message === '400') {
      res.status(400).end();
      return;
    }

    res.status(500).send(err.message);
  }
}

function logout(req, res) {
  if (!req.user) {
    res.status(401).end();
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      res.status(500).end();
      return;
    }

    res.end();
  });
}

async function register(req, res) {
  try {
    let user;

    user = await db.users.findByField('nickname', req.body.nickname);

    if (user) {
      res.status(409).send({ error: 'nickname' });
      return;
    }

    user = await db.users.findByField('email', req.body.email);
    if (user) {
      res.status(409).send({ error: 'email' });
      return;
    }

    user = await db.users.register(req.body);

    res.json(user);
  } catch (err) {
    res.status(404).end();
  }
}

async function authCheck(req, res, next) {
  if (!req.user) {
    res.status(401).end();
    return;
  }

  next();
}

function getUser(req, res) {
  if (!req.user) {
    res.status(401).end();
    return;
  }

  res.json({ nickname: req.user.nickname, email: req.user.email });
}

async function changeLang(req, res) {
  try {
    await db.users.update(req.body);
    res.status(200).end();
  } catch (err) {
    res.status(404).end();
  }
}

module.exports = {
  login,
  logout,
  authCheck,
  getUser,
  register,
  changeLang,
};
