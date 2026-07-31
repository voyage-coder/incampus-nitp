# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# from app.core.config import DATABASE_URL

# # create engine
# engine = create_engine(DATABASE_URL)

# # create session factory
# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )

# # create Base
# Base = declarative_base() # think this as parent class
# # tells SQLA every child class is a DB model

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Check connection before using it
    pool_recycle=300,        # Recycle idle connections every 5 min
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()