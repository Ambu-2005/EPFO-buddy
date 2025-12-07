# 📌 EPFO Buddy

An AI-powered web application that provides instant, accurate answers to all EPFO (Employees' Provident Fund Organisation) related queries. Built with React, Node.js, and powered by Groq's Llama 3.3 70B language model.

🌐 **Live Demo:** [https://epfo-buddy.onrender.com](https://epfo-buddy.onrender.com)

---

## 🎯 Problem Statement

Millions of Indian employees struggle to navigate the complex EPFO system. Common challenges include understanding withdrawal processes, deciphering passbook statements, checking claim status, and accessing accurate information about PF regulations. The existing EPFO portal and helpline are often difficult to navigate, leading to confusion, delays, and frustration for users.

---

## ✨ Features

### 🤖 AI-Powered Chatbot
- Ask questions in natural language (English or Hindi)
- Get instant, accurate responses powered by Groq's Llama 3.3 70B
- Context-aware conversations with intelligent understanding

### 📸 Passbook Image Analysis
- Upload EPFO passbook images
- Automatic OCR text extraction using Tesseract.js
- AI interprets and explains passbook details in simple language

### 🎤 Voice Input
- Speak your questions instead of typing
- Supports both English and Hindi voice recognition
- Hands-free operation for enhanced accessibility

### 🌐 Multilingual Support
- Seamless switching between English and Hindi
- AI responds in your selected language
- Internationalization powered by i18next

### 📜 Conversation History
- All queries and answers saved locally
- Easily reference previous conversations
- Persistent storage across sessions

### 🎨 Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark mode for comfortable viewing
- Material-UI components for professional look
- Smooth animations and transitions

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Material-UI (MUI) v7** - Component library
- **Vite** - Fast build tool and dev server
- **i18next** - Internationalization framework
- **Tesseract.js** - OCR for image processing
- **React Markdown** - Formatted AI responses
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Groq API** - AI language model integration (Llama 3.3 70B)
- **Multer** - File upload handling
- **Tesseract.js** - Server-side OCR
- **dotenv** - Environment variable management

### Deployment
- **Render** - Cloud platform for hosting
- **GitHub** - Version control and CI/CD

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Groq API key ([Get one here](https://console.groq.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ambu-2005/EPFO-buddy.git
cd EPFO-buddy
```

2. **Install dependencies**

For client:
```bash
cd client
npm install --legacy-peer-deps
```

For server:
```bash
cd ../server
npm install
```

3. **Set up environment variables**

Create a `.env` file in the `server` folder:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

4. **Run the application**

Start the server (from server folder):
```bash
npm run dev
```

Start the client (from client folder):
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
EPFO-buddy/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, icons
│   │   ├── locales/       # Translation files
│   │   ├── App.jsx        # Main application component
│   │   ├── i18n.js        # i18next configuration
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── middleware/        # Custom middleware (PII masking)
│   ├── utils/            # Utility functions (letter templates)
│   ├── index.js          # Main server file
│   ├── package.json
│   └── .env              # Environment variables (not in repo)
│
├── package.json          # Root package.json for deployment
├── render-build.sh       # Build script for Render
└── README.md            # This file
```

---

## 🔧 API Endpoints

### POST `/ask`
Ask a text-based question

**Request:**
```json
{
  "question": "How do I withdraw my PF?"
}
```

**Response:**
```json
{
  "answer": "To withdraw your PF, you need to..."
}
```

### POST `/ask-image`
Upload and analyze passbook image

**Request:**
- Content-Type: `multipart/form-data`
- Field: `image` (file)

**Response:**
```json
{
  "answer": "Your passbook shows..."
}
```

### POST `/letter`
Generate a formal letter template

**Request:**
```json
{
  "name": "John Doe",
  "issue": "PF withdrawal delay"
}
```

**Response:**
```json
{
  "letter": "To whom it may concern..."
}
```

### GET `/health`
Health check endpoint

**Response:**
```
✅ EPFO Buddy Server is healthy!
```

---

## 🌍 Environment Variables

### Server (.env)
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

### Client (optional .env)
```env
VITE_API_URL=http://localhost:3001
```

---

## 🚢 Deployment

### Deploy on Render

1. **Push your code to GitHub**

2. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Root Directory: Leave blank
   - Environment: Node
   - Build Command: `cd client && npm install --legacy-peer-deps && npm run build && cd ../server && npm install`
   - Start Command: `cd server && npm start`

3. **Add Environment Variables**
   - `GROQ_API_KEY`: Your Groq API key

4. **Deploy!**

The app will be live at your Render URL (e.g., `https://epfo-buddy.onrender.com`)

---

## 🎓 How It Works

1. **User Input**: User types or speaks a question
2. **PII Masking**: Server masks any personal information for privacy
3. **AI Processing**: Query sent to Groq API (Llama 3.3 70B model)
4. **Response**: AI generates accurate, contextual answer
5. **Display**: Answer shown with markdown formatting
6. **History**: Conversation saved locally for reference

For image uploads:
1. User uploads passbook image
2. Tesseract.js extracts text via OCR
3. Extracted text sent to AI for interpretation
4. AI explains the passbook details clearly

---

## 🔒 Privacy & Security

- **PII Masking**: Personal information is masked before sending to AI
- **No Server Storage**: User data not stored on server
- **Local History**: Conversations stored only in browser
- **HTTPS**: Secure communication in production
- **Environment Variables**: API keys stored securely

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Known Issues

- Free tier on Render may have cold start delays (~30 seconds)
- Voice recognition requires HTTPS (works in production)
- OCR accuracy depends on image quality

---

## 📝 Future Enhancements

- [ ] Add more Indian languages (Tamil, Telugu, Bengali, etc.)
- [ ] Integrate with official EPFO APIs for real-time data
- [ ] Add authentication for personalized experience
- [ ] Mobile app (React Native)
- [ ] WhatsApp bot integration
- [ ] Retirement planning calculator
- [ ] Email notifications for claim status
- [ ] PDF export of conversations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ambadas**
- GitHub: [@Ambu-2005](https://github.com/Ambu-2005)
- Project Link: [https://github.com/Ambu-2005/EPFO-buddy](https://github.com/Ambu-2005/EPFO-buddy)

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) - For providing the AI API
- [EPFO](https://www.epfindia.gov.in) - For the service this app supports
- [Material-UI](https://mui.com) - For the beautiful component library
- [Tesseract.js](https://tesseract.projectnaptha.com/) - For OCR capabilities
- [Render](https://render.com) - For free hosting platform

---

## 📞 Support

If you have any questions or issues:
- Open an issue on [GitHub](https://github.com/Ambu-2005/EPFO-buddy/issues)
- Contact: [Your email if you want to add]

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

**Made with ❤️ for Indian workers**