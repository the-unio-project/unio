from uuid import UUID

from fastapi import Depends, HTTPException

from datetime import datetime, timedelta, timezone
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from Database.database import get_session
from Models.models import User

from main import SECRET_KEY, ALGORITHM, AT_TIMEOUT
from Services.Authentication import pwd_handler
from Repositories import user_repo

# HTTPBearer

http_bearer = HTTPBearer()

# Token Creation

def create_token(uid, time_delta:timedelta = timedelta(minutes=int(AT_TIMEOUT))):
    expiry_date = datetime.now(timezone.utc) + time_delta
    dic_info = {
            "sub": str(uid),
            "exp": expiry_date
            }

    encoded_jwt = jwt.encode(dic_info, SECRET_KEY, ALGORITHM)
    return (encoded_jwt, expiry_date)

# Verify the Token

def verify_token(creds:HTTPAuthorizationCredentials = Depends(http_bearer), session:Session = Depends(get_session)) -> User:
    try:
        dic_info = jwt.decode(creds.credentials, SECRET_KEY, ALGORITHM)
        user_id = str(dic_info.get("sub"))
    except JWTError as error:
        raise HTTPException(status_code=401, detail="Access Denied")

    usuario = user_repo.get_by_id(UUID(user_id), session)

    if not usuario:
        raise HTTPException(status_code=401, detail="Invalid Access")
    return usuario

# Password Hash

def auth_user(email, password, session:Session):
    user = session.query(User).filter(User.email==email).first()

    if not user:
        return False
    elif not pwd_handler.verify_password(password, user.password):
        return False
    return user
