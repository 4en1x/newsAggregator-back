const controller = require('../controllers/articles.controller');
const router = require('express').Router();

router.get('/', (req, res) => controller.getArticles(req, res));
router.get('/:id', (req, res) => controller.getArticle(req, res));
router.delete('/:id', (req, res) => controller.deleteArticle(req, res));
router.put('/like/:id', (req, res) => controller.likeArticle(req, res));
router.get('/liked/:page', (req, res) => controller.getLikedArticles(req, res));

module.exports = router;
