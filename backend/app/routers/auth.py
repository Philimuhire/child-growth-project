# Router for user registration, login, and the current-user dependency

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.schemas import AuthInput, TokenResponse, UserResponse
from ..models.user import User
from ..services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Reads the "Authorization: Bearer <token>" header
_bearer = HTTPBearer(auto_error=False)


# Dependency: resolve the currently authenticated user from the bearer token.
# Attach to any protected endpoint with `user: User = Depends(get_current_user)`.
def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = auth_service.decode_access_token(credentials.credentials)
    if payload is None or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = auth_service.get_user_by_id(db, int(payload["sub"]))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
        )
    return user


# Create a new account and return a token so the user is logged in immediately
@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: AuthInput, db: Session = Depends(get_db)):
    if auth_service.get_user_by_username(db, payload.username) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="That username is already taken.",
        )

    user = auth_service.create_user(db, payload.username, payload.password)
    token = auth_service.create_access_token(user)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


# Log in with username + password
@router.post("/login", response_model=TokenResponse)
async def login(payload: AuthInput, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, payload.username, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
        )

    token = auth_service.create_access_token(user)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


# Return the profile of the currently logged-in user
@router.get("/me", response_model=UserResponse)
async def me(user: User = Depends(get_current_user)):
    return UserResponse.model_validate(user)
