from enum import Enum


class ItemCategory(str, Enum):
    BOOKS = "BOOKS"
    ELECTRONICS = "ELECTRONICS"
    FURNITURE = "FURNITURE"
    STATIONERY = "STATIONERY"
    CLOTHING = "CLOTHING"
    SPORTS = "SPORTS"
    OTHERS = "OTHERS"