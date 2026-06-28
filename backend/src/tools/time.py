"""报时工具 — 纯本地"""

from datetime import datetime

_weekdays = ["一", "二", "三", "四", "五", "六", "日"]


def now():
    return datetime.now()
