"""
天气路由 — GET /api/weather?city=邯郸
调用高德天气 API
"""
import httpx
from fastapi import APIRouter, Query
#获取高德天气 API Key
from ..config import AMAP_WEATHER_KEY
from ..schemas.weather import WeatherOut

router = APIRouter()

# 高德天气 API 地址
AMAP_URL = "https://restapi.amap.com/v3/weather/weatherInfo"

# ────────────────── 天气请求 ──────────────────
async def fetch_weather(city: str = "邯郸") -> WeatherOut:
    """
    查询实时天气
    - 先拿城市的 adcode
    - 再查天气
    """
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(AMAP_URL, params={
                "key": AMAP_WEATHER_KEY,
                "city": city,
                "extensions": "base",  # base=实时, all=预报
            })
            data = resp.json()

            if data.get("status") != "1":
                return WeatherOut(
                    city=city, temperature="--", humidity="--",
                    weather_desc="天气不可用", error=data.get("info", "查询失败")
                )

            live = data["lives"][0]
            return WeatherOut(
                city=live["city"],
                temperature=f"{live['temperature']}",
                humidity=f"{live['humidity']}",
                weather_desc=live["weather"],
                wind_speed=f"{live['windpower']}级 {live['winddirection']}",
                source="高德地图",
            )

        except Exception as e:
            return WeatherOut(
                city=city, temperature="--", humidity="--",
                weather_desc="天气不可用", error=str(e)
            )

# ────────────────── 获取天气路由 ──────────────────
@router.get("/weather", response_model=WeatherOut)
async def get_weather(city: str = Query("邯郸", description="城市名称")):
    return await fetch_weather(city)