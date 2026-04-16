/**
 * Chatbot Service for PastCAST-AI
 * Handles communication with the NLP/NLM-powered backend
 */

export interface ChatbotMessage {
  text: string;
  conversation_history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatbotResponse {
  reply: string;
  timestamp: string;
  model: string;
  status: string;
  confidence?: number;
  dataSource?: string;
}

export interface ChatbotError {
  error: string;
  message?: string;
  timestamp: string;
}

class ChatbotService {
  private baseUrl: string;

  constructor() {
    // Use environment variable or default to localhost:8000
    this.baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  }

  /**
   * Send a message to the chatbot backend
   * @param message User message text
   * @param conversationHistory Optional conversation history for context
   * @returns Promise with chatbot response
   */
  async sendMessage(
    message: string,
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<ChatbotResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          conversation_history: conversationHistory || [],
        }),
      });

      if (!response.ok) {
        const errorData: ChatbotError = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: ChatbotResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Chatbot service error:', error);
      throw error;
    }
  }

  /**
   * Send a message using the legacy chatbot endpoint
   * @param text \text
   * @returns Promise with chatbot response
   */
  async sendChatbotMessage(text: string): Promise<ChatbotResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData: ChatbotError = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: ChatbotResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Chatbot service error:', error);
      throw error;
    }
  }

  /**
   * Check backend health
   * @returns Promise with health status
   */
  async checkHealth(): Promise<{
    status: string;
    service: string;
    timestamp: string;
    openai_configured: boolean;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatbotService = new ChatbotService();

