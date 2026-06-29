"""TTS 路由 — POST /api/tts  文字转语音（火山引擎）"""
import io
import json
import base64
import uuid
import httpx
from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel
from ..config import TTS_KEY

router = APIRouter()

TTS_URL = "https://openspeech.bytedance.com/api/v3/tts/unidirectional"
SPEAKER = "S_965xcsj72"      # 你的复刻音色
RESOURCE_ID = "seed-icl-2.0"           # 声音复刻大模型2.0


class TTSRequest(BaseModel):
    text: str


@router.post("/tts")
async def tts(req: TTSRequest):
    text = req.text.strip() or "（空消息）"

    headers = {
        "X-Api-Key": TTS_KEY,
        "X-Api-Resource-Id": RESOURCE_ID,
        "Content-Type": "application/json",
        "Connection": "keep-alive",
    }

    body = {
        "req_params": {
            "text": text,
            "speaker": SPEAKER,
            "model": "seed-tts-2.0-expressive",      # 复刻音色必须用 expressive
            "audio_params": {
                "format": "mp3",
                "sample_rate": 24000,
            },
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        async with client.stream("POST", TTS_URL, headers=headers, json=body) as resp:
            audio_data = bytearray()
            async for line in resp.aiter_lines():
                if not line:
                    continue
                try:
                    chunk = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if chunk.get("code") == 20000000:
                    break  # 合成完成
                if chunk.get("data"):
                    audio_data.extend(base64.b64decode(chunk["data"]))

    buf = io.BytesIO(audio_data)
    buf.seek(0)
    return Response(content=buf.read(), media_type="audio/mpeg")
