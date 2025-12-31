const express = require('express');
const router = express.Router();
const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');

// POST /api/articles -> createArticle
router.post('/articles', createArticle);

// GET /api/articles -> getAllArticles
router.get('/articles', getAllArticles);

// GET /api/articles/:id -> getArticleById
router.get('/articles/:id', getArticleById);

// PUT /api/articles/:id -> updateArticle
router.put('/articles/:id', updateArticle);

// DELETE /api/articles/:id -> deleteArticle
router.delete('/articles/:id', deleteArticle);

module.exports = router;