// AI Testing Chatbot - Gemini Integration
const GEMINI_API_KEY = 'AIzaSyDa3ZdZ-Lv9U4Nw07cjETFABHuoLyuTNjg'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// System prompt for AI Testing chatbot
const SYSTEM_PROMPT = `You are an expert AI Testing and SDET specialist helping users learn about AI-driven testing, test automation, and quality assurance best practices. 
Your expertise includes:
- AI/ML testing strategies
- SDET (Software Development Engineer in Test) practices
- Test automation frameworks
- Prompt testing and validation
- Testing best practices
- Quality assurance methodologies

Provide helpful, concise, and practical answers focused on AI testing and automation. Keep responses clear and relevant to the user's question.`;

async function sendMessage() {
  const message = userInput.value.trim();
  
  if (!message) return;
  
  // Display user message
  displayMessage(message, 'user');
  userInput.value = '';
  userInput.focus();
  
  // Show loading indicator
  displayMessage('Typing...', 'bot-loading');
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topK: 40,
          topP: 0.95
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
            
            // Check for API errors
            if (data.error) {
                throw new Error(data.error.message || 'API Error occurred');
            }
            
            // Ensure we have candidates
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts[0]) {
                console.error('Unexpected API response:', data);
                throw new Error('Invalid response format from API');
            }
            
            const botResponse = data.candidates[0].content.parts[0].text;
    displayMessage(botResponse, 'bot');
    
  } catch (error) {
    removeLoadingIndicator();
    displayMessage(`Sorry, I encountered an error: ${error.message}. Please make sure your API key is valid.`, 'bot-error');
    console.error('Chatbot Error:', error);
  }
}

function displayMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  
  // Auto-scroll to latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoadingIndicator() {
  const loadingMsg = chatMessages.querySelector('.bot-loading');
  if (loadingMsg) {
    loadingMsg.remove();
  }
}

// Temporarily disabled - backend migration in progress
    /*
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Initial greeting
    window.addEventListener('load', () => {
        displayMessage('👋 Hi! I\'m your AI Testing Assistant. Ask me anything about AI testing, test automation, SDET practices, or quality assurance!', 'bot');
    });
    */
    
    // Show offline message instead
    window.addEventListener('load', () => {
        displayMessage('🔧 Chatbot temporarily offline - upgrading for better security. Check back soon!', 'bot');
});
