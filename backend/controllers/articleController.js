const Article = require('../models/Article');

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, originalUrl, references } = req.body;
    
    const article = new Article({
      title,
      content,
      originalUrl,
      references
    });
    
    await article.save();
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    const { title, content, originalUrl, references } = req.body;
    
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, originalUrl, references, isUpdated: true },
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};