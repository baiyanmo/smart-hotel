"""天气相关 Schema"""
from pydantic import BaseModel
from typing import Optional


class WeatherOut(BaseModel):
    city: str
    temperature: str
    humidity: str
    weather_desc: str
    wind_speed: Optional[str] = None
    feels_like: Optional[str] = None
    source: Optional[str] = None
    error: Optional[str] = None
