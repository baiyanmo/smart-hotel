"""项目配置 — 从 .env 读取"""
import os
from dotenv import load_dotenv

load_dotenv()  # 读取 backend/.env

AMAP_WEATHER_KEY = os.getenv("AMAP_KEY", "")
DOUBAO_CHAT_KEY = os.getenv("DOUBAO_KEY", "")
TTS_KEY = os.getenv("TTS_KEY", "")
