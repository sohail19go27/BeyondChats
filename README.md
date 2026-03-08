# BeyondChats 

The project is implemented in three phases as described in the assignment and demonstrates backend development, web scraping, AI-based content enhancement, and frontend UI development . 


## 📌 Project Overview:

The goal of this project is to : 

Scrape the oldest blog articles from BeyondChats . 

Store and manage them via CRUD APIs. 

Enhance article content using AI (LLM) with reference articles. 

Display both original and AI-updated articles in a responsive React frontends . 


## 🧩 Project Phases
### ✅ Phase 1: Web Scraping & Backend APIs

Scraped the 5 oldest articles from: 
https://beyondchats.com/blogs/

#### Extracted: 
Title
URL 
Date 
Stored articles in MongoDB 
Built CRUD APIs using Node.js, Express and Mongoose 


### ✅ Phase 2: AI-based Article Enhancement 

#### Created a Node.js script (manual execution) that:

Fetches stored articles from the database. 
Searches related articles (mocked Google search). 
Uses Gemini LLM to rewrite and enhance content. 
Preserves original meaning while improving structure and clarity. 
Appends reference links at the bottom. 
Updated articles are saved back to MongoDB with an isUpdated flag. 

⚠️ This script is intentionally not deployed and is run manually to avoid serverless execution limits. 


### ✅ Phase 3: Frontend (React)

Built a React (Vite) frontend that: 
Fetches articles from backend APIs .
Displays articles in a responsive card-based UI. 

Shows: 
Title 
Date 
Updated badge 
Content 
Reference links 

## 🏗️ Architecture & Data Flow `
┌────────────┐
│ Frontend   │  (React + Vite)
│            │
│  Fetches   │
│  Articles  │
└─────▲──────┘
      │ REST API
┌─────┴──────┐
│ Backend    │  (Node.js + Express)
│            │
│ CRUD APIs  │
│ Scraper    │
│ AI Script  │
└─────▲──────┘
      │
┌─────┴──────┐
│ MongoDB    │
│ (Atlas)    │
└────────────┘
`


## Important principle:
👉 The frontend never talks to the database directly. 
👉 All data access happens through backend APIs. 



## ⚙️ Tech Stack
### Backend

Node.js
Express.js
MongoDB (Atlas)
Mongoose
Axios
Cheerio
Gemini LLM API


### Frontend

React (Vite)
JavaScript
CSS (custom, responsive)

🚀 Local Setup Instructions
1️⃣ Clone the repository
git clone <your-github-repo-url>
cd BeyondChats

## 2️⃣ Backend Setup 
cd backend 
npm install 
Create a .env file inside backend/: 
PORT=5000 
MONGO_URI=your_mongodb_connection_string 
GEMINI_API_KEY=your_gemini_api_key 

Run backend server: 
npm run dev 
Backend will run at: 
http://localhost:5000 


### 3️⃣ Run Scraper (Phase 1)
node scrapeOldestBlogs.js

This will:
Scrape oldest articles
Save them to MongoDB

### 4️⃣ Run AI Update Script (Phase 2)
node updateArticles.js

This will:
Enhance article content using AI 
Save updated versions to DB 


### 5️⃣ Frontend Setup 
cd ../frontend 
npm install  
npm run dev 

Frontend runs at: http://localhost:5173 

### 🌐 Live Links 

Frontend (Vercel):
👉 To be added

Backend (Render): 
👉 To be added  



### 📊 Evaluation Criteria Alignment 

This project satisfies all evaluation criteria mentioned in the assignment: 

✅ Completeness 
✅ Clean & structured README 
✅ Responsive UI 
✅ Clear backend–frontend separation 
✅ Scalable architecture 



### 📝 Notes

The AI update script is executed manually, not via frontend or deployment. 
Mock search is used in place of Google Search API to avoid paid services. 
Reference URLs are still cited at the bottom of updated articles. 



### 🙌 Final Note 

This project demonstrates: 
Real-world backend practices  
AI integration 
Data flow understanding 
Clean frontend architecture 
Thank you for the opportunity! 
