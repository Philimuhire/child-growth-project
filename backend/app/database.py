# SQLAlchemy database setup for user accounts

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import DATABASE_URL

# SQLite needs check_same_thread=False to be used across FastAPI's threads
_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=_connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Create all tables. Called once on application startup.
def init_db() -> None:
    # Import models so they are registered on the Base metadata before create_all
    from .models import user  # noqa: F401

    Base.metadata.create_all(bind=engine)


# FastAPI dependency that yields a database session and always closes it
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
