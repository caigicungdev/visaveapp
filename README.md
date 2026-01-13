# V-Tool 🚀

**AI-Powered Media Toolkit** — Download, summarize, analyze, and process videos from TikTok, YouTube, Instagram, and more.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📥 **Video Downloader** | Download videos without watermark from TikTok, YouTube, Instagram |
| 🧠 **AI Summarizer** | Generate AI-powered summaries of video content |
| 🔍 **Video Insights** | View hidden metadata, engagement stats, and tags |
| 🖼️ **Slideshow Downloader** | Extract all images from TikTok slideshows |
| 🎵 **Audio Extractor** | Extract MP3 audio + separate vocals/instrumental |
| 🎨 **Background Removal** | Remove backgrounds from images with AI |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, TailwindCSS v4 |
| **Backend** | Python FastAPI, Uvicorn |
| **Database** | Supabase (PostgreSQL + Auth) |
| **Media Processing** | yt-dlp, rembg, OpenCV, Demucs |
| **Deployment** | Docker, Nginx, Let's Encrypt |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- FFmpeg (`brew install ffmpeg` on macOS)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/caigicungdev/visaveapp.git
cd visaveapp

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
pip install yt-dlp demucs
cd ..

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development servers
npm run dev          # Frontend: http://localhost:3000
cd backend && python main.py  # Backend: http://localhost:8000
```

---

## 🐳 Docker Deployment

Deploy to a VPS (Hetzner, DigitalOcean, etc.) with one command:

```bash
# On your VPS
git clone https://github.com/caigicungdev/visaveapp.git
cd visaveapp

# Configure
cp .env.example .env
nano .env  # Add your secrets

# Deploy with SSL
chmod +x deploy.sh
./deploy.sh your-domain.com
```

### Docker Architecture

```
┌─────────────────────────────────────────────────┐
│                    VPS                          │
│  ┌─────────────────────────────────────────┐   │
│  │            Nginx (Port 80/443)           │   │
│  │           + Let's Encrypt SSL            │   │
│  └───────────────┬─────────────────────────┘   │
│                  │                              │
│     ┌────────────┴────────────┐                │
│     ▼                         ▼                │
│  ┌──────────┐          ┌────────────┐          │
│  │ Next.js  │          │  FastAPI   │          │
│  │  :3000   │          │   :8000    │          │
│  └──────────┘          └────────────┘          │
└─────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
v-tool/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── privacy-policy/    # Legal pages
│   └── terms-of-use/
├── components/            # React components
│   ├── feature-tabs.tsx   # Main feature tabs
│   ├── processor-form.tsx # URL input form
│   └── result-display.tsx # Results renderer
├── backend/               # FastAPI backend
│   ├── main.py           # API server
│   ├── tasks.py          # Task processors
│   ├── config.py         # Configuration
│   └── requirements.txt  # Python dependencies
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   ├── supabase/         # Supabase clients
│   └── translations.ts   # i18n strings
├── docker-compose.yml    # Docker orchestration
├── Dockerfile.frontend   # Next.js Docker build
├── Dockerfile.backend    # FastAPI Docker build
├── nginx.conf            # Reverse proxy config
└── deploy.sh             # Deployment script
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Supabase (Backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Supabase (Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Domain
DOMAIN=your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com

# Optional: OpenAI for enhanced AI summaries
# OPENAI_API_KEY=sk-your-key
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/process` | POST | Create processing task |
| `/api/tasks/{id}` | GET | Get task status/result |
| `/api/files/{filename}` | GET | Download processed files |
| `/api/v1/remove-bg` | POST | Remove image background |
| `/api/v1/remove-watermark` | POST | Remove image watermark |
| `/health` | GET | Health check |

---

## 🌐 Supported Platforms

- ✅ TikTok (videos, slideshows)
- ✅ YouTube (videos, shorts)
- ✅ Instagram (reels, stories)
- ✅ Facebook (videos)
- ✅ Twitter/X (videos)
- ✅ And 1000+ more via yt-dlp

---

## 🔒 Security

- All API keys are stored in environment variables
- Rate limiting enabled per endpoint
- CORS configured for production domains
- Non-root Docker containers
- SSL/TLS via Let's Encrypt

---

## 📜 License

MIT License - feel free to use for personal or commercial projects.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/caigicungdev">caigicungdev</a>
</p>
