"""Live2D 动作/表情调度 — 水色小熊
动作: 待机动画, 打瞌睡
表情: 变小, 发夹, 发饰, 后发1, 后发2, 外衣, 奶茶, 小熊, 手机,
      打米, 斜刘海, 星星, 流泪, 爱心, 生气, 眼罩, 短发, 耳朵发饰,
      脸红, 脸黑, 麦克风, 黑发
"""


class Live2DActions:
    """水色小熊全部动作/表情"""

    # ──────────── 动作 ────────────

    @staticmethod
    def idle() -> tuple[str | None, str | None]:
        """待机 — 按键 [1]"""
        return None, "待机动画"

    @staticmethod
    def doze() -> tuple[str | None, str | None]:
        """打瞌睡 — 按键 [2]"""
        return None, "打瞌睡"

    # ──────────── 表情 第1页 Q-P ────────────

    @staticmethod
    def hair_clip() -> tuple[str | None, str | None]:
        """发夹 — 按键 [Q]"""
        return "发夹", None

    @staticmethod
    def hair_ornament() -> tuple[str | None, str | None]:
        """发饰 — 按键 [W]"""
        return "发饰", None

    @staticmethod
    def small() -> tuple[str | None, str | None]:
        """变小 — 按键 [E]"""
        return "变小", None

    @staticmethod
    def hair_back1() -> tuple[str | None, str | None]:
        """后发1 — 按键 [R]"""
        return "后发1", None

    @staticmethod
    def hair_back2() -> tuple[str | None, str | None]:
        """后发2 — 按键 [T]"""
        return "后发2", None

    @staticmethod
    def coat() -> tuple[str | None, str | None]:
        """外衣 — 按键 [Y]"""
        return "外衣", None

    @staticmethod
    def milk_tea() -> tuple[str | None, str | None]:
        """奶茶 — 按键 [U]"""
        return "奶茶", None

    @staticmethod
    def bear() -> tuple[str | None, str | None]:
        """小熊 — 按键 [I]"""
        return "小熊", None

    @staticmethod
    def phone() -> tuple[str | None, str | None]:
        """手机 — 按键 [O]"""
        return "手机", None

    @staticmethod
    def tear() -> tuple[str | None, str | None]:
        """打米 — 按键 [P]"""
        return "打米", None

    # ──────────── 表情 第2页 Shift+Q ~ Shift+P ────────────

    @staticmethod
    def side_bang() -> tuple[str | None, str | None]:
        """斜刘海 — 按键 [shift+Q]"""
        return "斜刘海", None

    @staticmethod
    def star() -> tuple[str | None, str | None]:
        """星星眼 — 按键 [shift+W]"""
        return "星星", None

    @staticmethod
    def cry() -> tuple[str | None, str | None]:
        """流泪 — 按键 [shift+E]"""
        return "流泪", None

    @staticmethod
    def love() -> tuple[str | None, str | None]:
        """爱心 — 按键 [shift+R]"""
        return "爱心", None

    @staticmethod
    def angry() -> tuple[str | None, str | None]:
        """生气 — 按键 [shift+T]"""
        return "生气", None

    @staticmethod
    def eyepatch() -> tuple[str | None, str | None]:
        """眼罩 — 按键 [shift+Y]"""
        return "眼罩", None

    @staticmethod
    def short_hair() -> tuple[str | None, str | None]:
        """短发 — 按键 [shift+U]"""
        return "短发", None

    @staticmethod
    def ear_ornament() -> tuple[str | None, str | None]:
        """耳朵发饰 — 按键 [shift+I]"""
        return "耳朵发饰", None

    @staticmethod
    def blush() -> tuple[str | None, str | None]:
        """脸红 — 按键 [shift+O]"""
        return "脸红", None

    @staticmethod
    def black_face() -> tuple[str | None, str | None]:
        """脸黑（无语/热晕） — 按键 [shift+P]"""
        return "脸黑", None

    # ──────────── 表情溢出 3-4 ────────────

    @staticmethod
    def mic() -> tuple[str | None, str | None]:
        """麦克风 — 按键 [3]"""
        return "麦克风", None

    @staticmethod
    def black_hair() -> tuple[str | None, str | None]:
        """黑发 — 按键 [4]"""
        return "黑发", None
