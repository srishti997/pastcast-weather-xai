# 🚀 Quick Start Guide - GPT-2 Backend

## ✅ Backend is Now 100% FREE!

The backend now uses Hugging Face GPT-2 model - no API key, no billing, completely free!

## 🎯 Quick Setup (5 minutes)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (if not exists)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend
python app.py
```

**First Run:**
- GPT-2 model will download (~500MB)
- Takes 2-5 minutes on first run
- Subsequent runs are much faster!
- Model runs completely offline after download

### 2. Frontend Setup

```bash
# From project root
npm install
npm start
```

### 3. Test It!

1. Open http://localhost:3000
2. Click the chatbot widget
3. Ask: "What will the weather be like tomorrow?"
4. Get AI-generated response from GPT-2!

## 🎉 Benefits

- ✅ **100% Free** - No API costs
- ✅ **No API Key** - No configuration needed
- ✅ **Offline** - Works without internet (after download)
- ✅ **Privacy** - Data stays on your machine
- ✅ **Academic** - Perfect for NLP/NLM projects

## 📊 Features

- **GPT-2 Model**: Free, offline text generation
- **Historical Data**: Optional CSV trend analysis
- **Weather Focus**: Optimized for weather/climate queries
- **Logging**: Complete request/response logging

## 🔧 Troubleshooting

### Model download is slow
- First download takes 2-5 minutes (one-time only)
- Subsequent runs are much faster
- Check internet connection

### Out of memory
- GPT-2 needs ~2GB RAM
- Close other applications
- Consider using a smaller model

### Backend won't start
- Check Python version (3.8+)
- Verify dependencies: `pip install -r requirements.txt`
- Check logs: `backend/logs/chatbot.log`

## 📝 API Endpoints

- `POST /api/message` - Main endpoint
- `POST /api/chatbot` - Legacy endpoint
- `GET /health` - Health check

## 🎓 Perfect for Academic Projects

This setup is ideal for:
- NLP/NLM course projects
- Academic research
- Learning about neural language models
- Weather/climate analysis projects

## 🚀 Ready to Go!

Your backend is now running with GPT-2 - completely free and ready to use!

---

**Status:** ✅ Ready
**Model:** GPT-2 (Hugging Face)
**Cost:** $0.00
**API Key:** Not Required

