import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;

const GEMINI_API_KEY = 'AIzaSyBxxDTsQHcb35_cc5Atl0vPci2zilKWKN8'; // Replace with actual key

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  const isRelevantTopic = (msg) => {
    const relevantKeywords = [
      'cybercrime', 'cyber crime', 'cybersecurity', 'cyber security', 
      'indian cyber law', 'digital crime', 'internet safety', 
      'data protection', 'cyber fraud', 'hacking', 'india'
    ];
    const lowercaseMsg = msg.toLowerCase();
    return relevantKeywords.some(keyword => lowercaseMsg.includes(keyword));
  };

  const payload = {
    contents: [{
      parts: [{
        text: isRelevantTopic(message) 
          ? `You are an AI assistant focused on cybersecurity in India. 
             Provide detailed information about cybersecurity or cybercrime in India. 
             User: ${message}`
          : `This query is not related to cybersecurity or cybercrime in India. 
             Politely reject the query and suggest asking about Indian cybersecurity topics.`
      }]
    }],
    safety_settings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ],
    generation_config: {
      temperature: 0.7,
      maxOutputTokens: 300
    }
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = 
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
      'Unable to generate a response. Please ask about cybersecurity in India.';

    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch AI response. Please check your API configuration.'
    });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));