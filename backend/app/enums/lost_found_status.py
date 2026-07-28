from enum import Enum


class LostFoundStatus(str, Enum):
    OPEN = "OPEN"
    CLAIMED = "CLAIMED"