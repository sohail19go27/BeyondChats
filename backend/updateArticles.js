require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Article = require('./models/Article');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Mock Google search function (replace with SerpAPI if needed)
const searchRelatedArticles = async (title) => {
  try {
    // For demonstration, returning mock URLs
    // Replace with actual SerpAPI call:
    // const response = await axios.get('https://serpapi.com/search', {
    //   params: { q: title, api_key: process.env.SERPAPI_KEY }
    // });
    console.log(`  Searching for related articles about: "${title}"`);
    
    // Mock results - replace with actual search results
    return [
      "https://www.ibm.com/topics/chatbots",
  "https://www.oracle.com/chatbots/what-is-a-chatbot/"
    ];
  } catch (error) {
    console.error('  Error searching articles:', error.message);
    return [];
  }
};

// Scrape article content
const scrapeArticleContent = async (url) => {
  try {
    console.log(`  Scraping content from: ${url}`);

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      },
      timeout: 15000
    });

    const $ = cheerio.load(data);
    $('script, style, nav, header, footer, aside').remove();

    const content =
      $('article').text().trim() ||
      $('main').text().trim() ||
      $('.content').text().trim();

    return content.slice(0, 3000);
  } catch (error) {
    console.error(`  Error scraping ${url}: ${error.message}`);
    return '';
  }
};


// Rewrite article using Gemini AI
const rewriteArticleWithAI = async (originalTitle, originalContent, referenceContents) => {
  try {
    console.log(`  Rewriting article with AI...`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
You are an expert content writer. Rewrite the following article to improve its structure, clarity, and depth while preserving the original meaning.

Original Title: ${originalTitle}

Original Content: ${originalContent}

Reference Articles for Context:
${referenceContents.map((content, i) => `\nReference ${i + 1}:\n${content.substring(0, 1000)}`).join('\n')}

Instructions:
- Improve structure with clear headings and paragraphs
- Enhance clarity and readability
- Add depth and insights based on reference articles
- Preserve the original core message
- Use professional, engaging tone
- Return only the rewritten article content, no explanations

Rewritten Article:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('  Error rewriting with AI:', error.message);
    return originalContent;
  }
};

// Main update function
const updateArticles = async () => {
  try {
    console.log('Starting article update process...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
    
    // Fetch articles that need updating
    const articles = await Article.find({ isUpdated: false });
    console.log(`Found ${articles.length} articles to update\n`);
    
    if (articles.length === 0) {
      console.log('No articles to update. Exiting...');
      return;
    }
    
    // Process each article
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      console.log(`\n[${i + 1}/${articles.length}] Processing: ${article.title}`);
      console.log('='.repeat(60));
      
      try {
        // Step 1: Search for related articles
        const relatedUrls = await searchRelatedArticles(article.title);
        const referenceUrls = relatedUrls.slice(0, 2);
        
        if (referenceUrls.length === 0) {
          console.log('  ⚠ No reference articles found, skipping...');
          continue;
        }
        
        console.log(`  Found ${referenceUrls.length} reference articles`);
        
        // Step 2: Scrape reference articles
        const referenceContents = [];
        for (const refUrl of referenceUrls) {
          const content = await scrapeArticleContent(refUrl);
          if (content) {
            referenceContents.push(content);
          }
        }
        
        if (referenceContents.length === 0) {
          console.log('  ⚠ Could not scrape reference content, skipping...');
          continue;
        }
        
        // Step 3: Rewrite article with AI
        const updatedContent = await rewriteArticleWithAI(
          article.title,
          article.content || 'No original content',
          referenceContents
        );
        
        // Step 4: Append references
        const referencesSection = '\n\n--- References ---\n' + 
          referenceUrls.map((url, idx) => `${idx + 1}. ${url}`).join('\n');
        
        const finalContent = updatedContent + referencesSection;
        
        // Step 5: Update article in database
        article.content = finalContent;
        article.references = referenceUrls;
        article.isUpdated = true;
        await article.save();
        
        console.log('  ✓ Successfully updated article');
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`  ✗ Error processing article: ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✓ Article update process completed!');
    
  } catch (error) {
    console.error('Fatal error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
};

// Run the script
updateArticles();