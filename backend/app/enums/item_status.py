from enum import Enum


class ItemStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    SOLD = "SOLD"