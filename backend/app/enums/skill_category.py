from enum import Enum


class SkillCategory(str, Enum):
    PROGRAMMING_LANGUAGE = "PROGRAMMING_LANGUAGE"
    FRAMEWORK = "FRAMEWORK"
    DATABASE = "DATABASE"
    TOOL = "TOOL"
    CLOUD = "CLOUD"
    OTHER = "OTHER"