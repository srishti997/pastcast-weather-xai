# PastCAST-AI: A Neural Language Model-Based Chatbot for Interactive Historical Data Analysis

A full-stack application featuring an AI-powered chatbot backend using OpenAI GPT-4o-mini and a React-based frontend for weather and climate data analysis.

## 🚀 Features

- **🤖 AI-Powered Chatbot**: Neural Language Model (NLM) powered by Hugging Face GPT-2 (100% FREE!)
- **💰 No API Costs**: Runs locally, no API key or billing required
- **🌤️ Weather Analysis**: Interactive weather data analysis and predictions
- **💬 Natural Language Processing**: Understands and responds to natural language queries
- **📊 Historical Data**: Analyze historical weather patterns and trends from CSV dataset
- **🔄 Offline Mode**: Works completely offline after initial model download
- **📝 Request/Response Logging**: Complete logging for analysis and debugging

## 📁 Project Structure

```
pastcast-frontend-main/
├── backend/                 # Flask backend with OpenAI integration
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example       # Environment variables template
│   ├── README.md          # Backend documentation
│   └── logs/              # Application logs
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── services/          # API services
│   └── config/            # Configuration files
├── public/                 # Static assets
└── package.json           # Frontend dependencies
```

## 🛠️ Setup Instructions

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** and **npm** (for frontend)
- **~2GB RAM** (for GPT-2 model)
- **~1GB disk space** (for model download)
- **Internet connection** (for first-time model download only)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend:**
   ```bash
   python app.py
   ```
   
   **Note:** First run will download GPT-2 model (~500MB). This takes 2-5 minutes but only happens once!
   
   Or use the startup script:
   ```bash
   # Linux/Mac
   chmod +x start_gpt2.sh
   ./start_gpt2.sh
   ```
   
   The backend will start on `http://localhost:8000`

   **No API key required!** GPT-2 runs locally and is completely free.

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 🧪 Testing the Application

1. **Start the backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

4. **Test the chatbot:**
   - Click on the chatbot widget (bottom right)
   - Ask questions like:
     - "What will the weather be like tomorrow in Mumbai?"
     - "Tell me about climate patterns in Delhi"
     - "What is the temperature forecast for next week?"

## 📡 API Endpoints

### POST `/api/message`

Main endpoint for processing user messages.

**Request:**
```json
{
  "text": "What will the weather be like tomorrow?",
  "conversation_history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help you?"}
  ]
}
```

**Response:**
```json
{
  "reply": "Based on current weather patterns...",
  "timestamp": "2024-01-15T10:30:00",
  "model": "gpt-4o-mini",
  "status": "success"
}
```

### POST `/api/chatbot`

Legacy endpoint for chatbot compatibility.

**Request:**
```json
{
  "userQuery": "What will the temperature be tomorrow?"
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "PastCAST-AI Backend",
  "timestamp": "2024-01-15T10:30:00",
  "openai_configured": true
}
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Backend port (default: 8000)
- `FLASK_ENV`: Flask environment (development/production)

**Frontend:**
- `REACT_APP_BACKEND_URL`: Backend URL (default: http://localhost:8000)

## 📊 Logging

All backend requests and responses are logged to:
- Console output
- `backend/logs/chatbot.log` file

## 🚢 Deployment

### Backend Deployment

#### Using Gunicorn (Production):

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

#### Using Render/Railway:

1. Connect your repository to Render/Railway
2. Set environment variables:
   - `OPENAI_API_KEY`
   - `PORT=8000`
3. Deploy

### Frontend Deployment

#### Using Vercel:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `REACT_APP_BACKEND_URL`: Your backend URL

## 🐛 Troubleshooting

### Backend Issues

**OpenAI API Key Not Working:**
- Verify your API key is correct in `.env`
- Check that you have credits in your OpenAI account
- Ensure the API key has the correct permissions

**Port Already in Use:**
- Change the `PORT` in `.env` file
- Update the frontend to use the new port

**CORS Errors:**
- Verify the frontend is making requests to the correct port (8000)
- Check that `flask-cors` is installed
- Verify the CORS configuration in `app.py`

### Frontend Issues

**Cannot Connect to Backend:**
- Ensure the backend is running on port 8000
- Check the `REACT_APP_BACKEND_URL` environment variable
- Verify CORS is enabled in the backend

**API Errors:**
- Check browser console for error messages
- Verify the backend is running and accessible
- Check backend logs in `backend/logs/chatbot.log`

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)

## 🎓 Project Title

**PastCAST-AI: A Neural Language Model-Based Chatbot for Interactive Historical Data Analysis**

This project demonstrates:
- Integration of Neural Language Models (NLM) in a production application
- Natural Language Processing (NLP) for user interaction
- Real-time AI-powered responses using OpenAI GPT-4o-mini
- Full-stack development with Flask and React
- RESTful API design and implementation

## 📝 License

This project is part of the PastCAST-AI application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using OpenAI GPT-4o-mini, Flask, and React**
