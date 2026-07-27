from enum import Enum # provides Enum class

class UserRole(str, Enum):
    STUDENT = "student"
    ADMIN = "admin"

# it inherit from str bcz we want enum values to bahave like normal strings
# print(UserRole.ADMIN) works naturally with JSON serialization and database storage
# UserRole.ADMIN.value gives admin
# now update schema