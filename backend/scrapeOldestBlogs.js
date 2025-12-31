const axios = require('axios');
const cheerio = require('cheerio');

const scrapeOldestBlogs = async () => {
  try {
    const url = 'https://beyondchats.com/blogs/page/14/';
    console.log(`Scraping ${url}...`);
    
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const articles = [];
    
    // Select article elements (adjust selectors based on actual HTML structure)
    $('.blog-post, article, .post-item').each((index, element) => {
      if (articles.length >= 5) return false; // Stop after 5 articles
      
      const title = $(element).find('h2, h3, .post-title, .blog-title').first().text().trim();
      const relativeUrl = $(element).find('a').first().attr('href');
      const url = relativeUrl?.startsWith('http') ? relativeUrl : `https://beyondchats.com${relativeUrl}`;
      const date = $(element).find('.date, .post-date, time').first().text().trim();
      
      if (title && url) {
        articles.push({ title, url, date: date || 'N/A' });
      }
    });
    
    console.log('\n5 Oldest Articles:');
    console.log('==================');
    articles.forEach((article, index) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   URL: ${article.url}`);
      console.log(`   Date: ${article.date}`);
    });
    
    // Save articles to backend API
    console.log('\n\nSaving articles to database...');
    console.log('================================');
    
    for (const article of articles) {
      try {
        const response = await axios.post('http://localhost:5000/api/articles', {
        title: article.title,
        content: 'Content will be generated using AI',
        originalUrl: article.url,
        references: []
});

        
        console.log(`✓ Successfully saved: ${article.title}`);
      } catch (error) {
        console.error(`✗ Failed to save: ${article.title}`);
        console.error(`  Error: ${error.response?.data?.error || error.message}`);
      }
    }
    
    return articles;
  }  catch (error) {
  if (error.response?.status === 400 || error.code === 11000) {
    console.log(`⚠ Skipped duplicate: ${article.title}`);
  } else {
    console.error(`✗ Failed to save: ${article.title}`);
  }
}
};

// Run the scraper
scrapeOldestBlogs();