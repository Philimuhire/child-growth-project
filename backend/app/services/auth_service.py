# Authentication service: password hashing, JWT tokens, and user lookup

from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from sqlalchemy.orm import Session

from ..config import ACCESS_TOKEN_EXPIRE_MINUTES, JWT_ALGORITHM, JWT_SECRET_KEY
from ..models.user import User


# --- Password hashing (bcrypt) ---

def hash_password(password: str) -> str:
    # bcrypt operates on bytes and caps the input at 72 bytes
    pw_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(pw_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    pw_bytes = password.encode("utf-8")[:72]
    try:
        return bcrypt.checkpw(pw_bytes, password_hash.encode("utf-8"))
    except ValueError:
        return False


# --- JWT tokens ---

def create_access_token(user: User) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user.id), "username": user.username, "exp": expire}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None


# --- User lookup / creation ---

def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def create_user(db: Session, username: str, password: str) -> User:
    user = User(username=username, password_hash=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = get_user_by_username(db, username)
    if user is None or not verify_password(password, user.password_hash):
        return None
    return user


# Create a user if one with this username doesn't already exist.
# Usernames are stored lowercase to match the login normalization. Returns True
# if a new user was created, False if it already existed.
def ensure_user(db: Session, username: str, password: str) -> bool:
    username = username.strip().lower()
    if get_user_by_username(db, username) is not None:
        return False
    create_user(db, username, password)
    return True
