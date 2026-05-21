import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Database
DATABASE_URL = f"sqlite:///{BASE_DIR}/agricheck.db"
CHAT_HISTORY_DB = f"sqlite:///{BASE_DIR}/chat_history.db"

# CORS origins
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "*"
]

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

# Threshold Constants (Based on Agricultural Research Standards)
SOIL_THRESHOLDS = {
    "N": {"min": 50, "max": 150},
    "P": {"min": 36, "max": 50},
    "K": {"min": 131, "max": 175},
    "pH": {"min": 5.8, "max": 6.5},
    "EC": {"min": 0.2, "max": 1.2} # mS/cm
}
