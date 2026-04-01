# 🚀 PastCAST-AI - Quick Start Guide

## ✅ Backend is Running!

Your backend is currently running with **GPT-2 (Hugging Face)** - 100% FREE!

### Backend Status
- ✅ **Status:** Running
- ✅ **Port:** 8000
- ✅ **Model:** GPT-2 (Hugging Face)
- ✅ **Model Loaded:** Yes
- ✅ **Cost:** $0.00 (Free!)

## 🎯 Next Steps: Start the Frontend

### Option 1: Start Frontend in New Terminal

Open a **new terminal window** and run:

```bash
cd "/Users/reesepallath/Downloads/pastcast-frontend-main 2/pastcast-frontend-main"
npm start
```

The frontend will start on **http://localhost:3000**

### Option 2: Test Backend API Directly

You can test the backend API directly:

```bash
# Health check
curl http://localhost:8000/health

# Test chatbot
curl -X POST http://localhost:8000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"userQuery":"What is the weather like today?"}'
```

## 🧪 Test the Application

1. **Open Browser:** http://localhost:3000
2. **Click Chatbot Widget:** Bottom right corner
3. **Ask Questions:** 
   - "What will the weather be like tomorrow?"
   - "Tell me about climate patterns"
   - "What is the temperature forecast?"

## 📊 Backend Endpoints

- **Health:** http://localhost:8000/health
- **Chatbot:** http://localhost:8000/api/chatbot
- **Message:** http://localhost:8000/api/message

## 🔍 Monitor Logs

```bash
tail -f backend/logs/chatbot.log
```

## 🎉 Features

- ✅ **100% Free** - No API costs
- ✅ **No API Key** - No configuration needed
- ✅ **Offline** - Works without internet (after download)
- ✅ **GPT-2 Model** - Neural language model
- ✅ **Historical Data** - CSV trend analysis
- ✅ **Weather Focus** - Optimized for weather/climate

## 🛑 Stop Backend

To stop the backend, press `Ctrl+C` in the terminal where it's running, or:

```bash
pkill -f "python app.py"
```

## 🚀 Restart Backend

```bash
cd backend
source venv/bin/activate
python app.py
```

## 📝 Files

- **Backend:** `backend/app.py`
- **Frontend:** `src/components/ChatbotWidget.tsx`
- **Logs:** `backend/logs/chatbot.log`
- **Data:** `backend/data/trends.csv`

---

**🎊 Your AI chatbot is ready to use!**

**Backend:** ✅ Running on port 8000
**Frontend:** Ready to start with `npm start`

