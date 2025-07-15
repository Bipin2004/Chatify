# Modern AI Chatbot Application

![AI Chatbot Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF/?text=AI+Chatbot)

A full-stack AI chat application featuring a modern UI with real-time messaging, powered by Google Gemini AI, built with MERN stack (MongoDB, Express, React, Node.js) and Socket.IO.

## 🌟 Features

- **AI-Powered Conversations**: Integration with Google Gemini model for intelligent responses
- **Real-time Messaging**: Instant communication using Socket.IO
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Authentication**: Secure user authentication and authorization with JWT
- **User Management**: Account creation and profile management
- **Web Search Integration**: AI assistant can search the web for information
- **Typing Indicators**: See when the AI is composing a response
- **Message History**: Persistent chat history stored in MongoDB
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Rate Limiting**: Protection against abuse with API rate limiting
- **Docker Support**: Easy deployment with Docker and Docker Compose

## 🏗️ Architecture

```
├── backend/            # Node.js Express server
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Authentication and rate limiting
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic and AI integration
│   └── utils/          # Helper functions
│
└── frontend/           # React application
    ├── public/         # Static assets
    └── src/
        ├── api/        # API client
        ├── components/ # UI components
        ├── context/    # Global state management
        ├── hooks/      # Custom React hooks
        └── pages/      # Main application views
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (v5+)
- Google Gemini API key

### Installation

#### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatbot.git
   cd chatbot
   ```

2. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://mongodb:27017/chatbot
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

3. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

4. Access the application at http://localhost:3000

#### Manual Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatbot.git
   cd chatbot
   ```

2. Setup Backend:
   ```bash
   cd backend
   npm install
   ```

3. Setup Frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with your configuration.

5. Start the backend server:
   ```bash
   cd ../backend
   npm run dev
   ```

6. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

7. Access the application at http://localhost:5173

## 🔧 Configuration

Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/chatbot
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro
PORT=5000
NODE_ENV=development
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🔒 Security Features

- JWT authentication for secure API access
- Password hashing with bcrypt
- Rate limiting to prevent brute-force attacks
- Helmet.js for securing HTTP headers
- Input validation with Joi/Celebrate

## 📱 Screenshots

*[Add application screenshots here]*

## 🛣️ Roadmap

- [ ] Voice message support
- [ ] File sharing capabilities
- [ ] Multi-user chat rooms
- [ ] Custom AI model training
- [ ] Integration with additional AI providers
- [ ] Dark/Light theme toggle
- [ ] Mobile app versions (React Native)
- [ ] User feedback collection for AI responses

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.IO](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini](https://ai.google.dev/)
- [Lucide React Icons](https://lucide.dev/)
