from app.db.database import SessionLocal
# this sessionLocal is a session factory - it creates sessions

def get_db():
    db = SessionLocal()
    # we are actually creating one session now - like opening one conversation with PSQL
    try:
        yield db
    finally:
        db.close()

# def get_db():
#     db = SessionLocal()
#     return db
# if we write like this FasAPI gets the session but after returning we can't close the session bcz the code after return never executes
# with yield - execution pauses at yield
# fastapi uses session when request finishes, execution resumes then db.close() runs automatically
# this guarantees every session is closed