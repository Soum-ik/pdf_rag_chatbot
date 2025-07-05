# PDF RAG Chat Application 🤖📄

A modern, AI-powered chat application that enables intelligent conversations with PDF documents using Retrieval-Augmented Generation (RAG) technology. Built with Next.js and featuring a beautiful glass morphism UI design.

![PDF RAG Chat](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🔐 **Secure Authentication** - Powered by Clerk for seamless user management
- 📄 **PDF Upload & Processing** - Drag & drop or click to upload PDF documents
- 💬 **Intelligent Chat Interface** - AI-powered conversations with document content
- 🎨 **Modern Glass Morphism UI** - Beautiful, professional design with glass effects
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🔍 **Source Citations** - View relevant document sections for each AI response
- ⚡ **Real-time Processing** - Fast document processing and chat responses
- 🌙 **Dark Theme** - Professional dark theme with excellent contrast

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glass morphism components
- **Authentication**: Clerk
- **Icons**: Lucide React
- **UI Components**: Custom shadcn/ui components

### Backend
- **API**: FastAPI (Python)
- **AI/ML**: LangChain for RAG implementation
- **Vector Database**: For document embeddings and similarity search
- **File Processing**: PDF parsing and text extraction

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Python 3.8+ (for backend)
- Clerk account for authentication

### Environment Variables

Create a `.env.local` file in the client directory:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Client Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pdf-rag-code.git
   cd pdf-rag-code/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd ../backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## 📱 Usage

1. **Sign In**: Use Clerk authentication to sign in to the application
2. **Upload PDF**: Drag and drop or click to upload a PDF document
3. **Wait for Processing**: The system will process and index your document
4. **Start Chatting**: Ask questions about your document content
5. **View Sources**: Check the source citations for AI responses

## 🎨 UI Components

### Glass Morphism Design
- Translucent glass cards with backdrop blur
- Subtle animations and hover effects
- Professional color palette with sky blue accents
- Smooth transitions and micro-interactions

### Key Components
- **FileUploadComponent**: Drag & drop file upload with status indicators
- **ChatComponent**: Real-time chat interface with message bubbles
- **Glass UI Elements**: Custom buttons, inputs, and cards
- **Responsive Layout**: Mobile-first design approach

## 📁 Project Structure

```
pdf-rag-code/
├── client/                 # Next.js frontend
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── globals.css     # Global styles & glass effects
│   │   ├── layout.tsx      # Root layout with auth
│   │   └── page.tsx        # Main page
│   ├── components/ui/      # Reusable UI components
│   ├── lib/               # Utility functions
│   └── public/            # Static assets
├── backend/               # FastAPI backend
│   ├── main.py           # FastAPI application
│   ├── models/           # Data models
│   ├── routers/          # API routes
│   └── services/         # Business logic
└── README.md             # This file
```

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Glass morphism utilities
- Custom color palette
- Animation classes
- Responsive breakpoints

### API Endpoints
- `POST /upload/pdf` - Upload and process PDF documents
- `GET /chat?message=` - Send chat messages and get AI responses

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create a new project on your preferred platform
2. Connect your repository
3. Add environment variables
4. Deploy the backend service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Clerk](https://clerk.com/) for authentication services
- [LangChain](https://langchain.com/) for RAG implementation
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

Made with ❤️ by Stack Soumik
