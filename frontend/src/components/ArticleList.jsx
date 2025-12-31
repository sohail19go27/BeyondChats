import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ArticleList.css';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/articles');
      setArticles(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch articles. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="article-list-container">
        <h1 className="page-title">BeyondChats Articles</h1>
        
        {articles.length === 0 ? (
          <div className="no-articles">No articles found.</div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <div key={article._id} className="article-card">
                <div className="article-header">
                  <h2 className="article-title">{article.title}</h2>
                  {article.isUpdated && (
                    <span className="updated-badge">Updated</span>
                  )}
                </div>
                
                <div className="article-meta">
                  <span className="article-date">
                    {formatDate(article.createdAt)}
                  </span>
                </div>
                
                <div className="article-content">
                  {article.content || 'No content available.'}
                </div>
                
                {article.references && article.references.length > 0 && (
                  <div className="article-references">
                    <div className="references-divider"></div>
                    <h4 className="references-label">References</h4>
                    <ul className="references-list">
                      {article.references.map((ref, index) => (
                        <li key={index}>
                          <a href={ref} target="_blank" rel="noopener noreferrer">
                            {ref}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="article-footer">
                  <a 
                    href={article.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="original-link"
                  >
                    View Original Article →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;