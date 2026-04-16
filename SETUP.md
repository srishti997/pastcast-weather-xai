# PastCAST-AI Setup Guide

Quick setup guide for getting PastCAST-AI up and running.

## Quick Start

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_key_here

# Start backend
python app.py
```

**Get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy it to your `.env` file

### 2. Frontend Setup (2 minutes)

```bash
# From project root
npm install
npm start
```

### 3. Test the Application

1. Open http://localhost:3000 in your browser
2. Click on the chatbot widget (bottom right)
3. Ask: "What will the weather be like tomorrow in Mumbai?"

## Troubleshooting

### Backend won't start

- **Check Python version:** `python3 --version` (should be 3.8+)
- **Check virtual environment:** Make sure it's activated
- **Check .env file:** Ensure OPENAI_API_KEY is set
- **Check port 8000:** Make sure it's not already in use

### Frontend can't connect to backend

- **Check backend is running:** Should see "Starting PastCAST-AI Backend on port 8000"
- **Check port:** Backend should be on port 8000
- **Check CORS:** Backend has CORS enabled by default
- **Check browser console:** Look for error messages

### OpenAI API errors

- **Check API key:** Verify it's correct in .env
- **Check credits:** Ensure you have credits in your OpenAI account
- **Check permissions:** API key should have chat completion permissions

## Next Steps

- Read the [Full README](./README.md) for detailed documentation
- Check [Backend README](./backend/README.md) for API documentation
- Explore the codebase to understand the architecture

## Support

If you encounter issues:
1. Check the logs in `backend/logs/chatbot.log`
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

---

**Happy Coding! 🚀**

