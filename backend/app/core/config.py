from dotenv import load_dotenv

import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

SECRET_KEY = os.getenv("SECRET_KEY")
# this is the secret used to sign JWTs
ALGORITHM = "HS256" # industry standard algo for symmetric JWT signing
ACCESS_TOKEN_EXPIRE_MINUTES = 30
# our token should not live forever - after 30 minutes users can refresh it

