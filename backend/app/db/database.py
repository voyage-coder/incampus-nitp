from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import DATABASE_URL

# create engine
engine = create_engine(DATABASE_URL)

# create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# create Base
Base = declarative_base() # think this as parent class
# tells SQLA every child class is a DB model