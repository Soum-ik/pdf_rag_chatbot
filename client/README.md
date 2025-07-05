# PDF RAG Chat Application

A modern Next.js application that enables intelligent conversations with PDF documents using Retrieval-Augmented Generation (RAG). Upload PDFs and chat with their content using AI.

## Features

- 🔐 **Secure Authentication** - Powered by Clerk
- 📄 **PDF Upload** - Drag & drop or click to upload PDF documents
- 💬 **Intelligent Chat** - AI-powered conversations with document content
- 🎨 **Modern UI** - Glass morphism design with beautiful animations
- 📱 **Responsive** - Works seamlessly on all devices

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **UI Components**: Custom glass morphism components
- **Icons**: Lucide React

## Environment Variables

Make sure to set up your environment variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
