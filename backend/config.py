import os
from dotenv import load_dotenv

load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# OpenAI Configuration (for AI Summary)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Server Configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# File Storage
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), "downloads")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# CORS Origins - add production domain from environment
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# Add production domain if set
PRODUCTION_DOMAIN = os.getenv("DOMAIN", "")
if PRODUCTION_DOMAIN:
    CORS_ORIGINS.extend([
        f"https://{PRODUCTION_DOMAIN}",
        f"http://{PRODUCTION_DOMAIN}",
    ])

# Proxy Configuration for YouTube downloads (to bypass IP blocks)
# Format: http://user:pass@host:port or socks5://host:port
PROXY_URL = os.getenv("PROXY_URL", "")
