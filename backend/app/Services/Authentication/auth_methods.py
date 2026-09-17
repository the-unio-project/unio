from fastapi import Depends, HTTPException

from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from Database.database import get_session
from Models.models import User

from main import SECRET_KEY, ALGORITHM, AT_TIMEOUT, oauth2_schema
from Services.Authentication import pwd_handler

# Token Creation

def create_token(uid, time_delta:timedelta = timedelta(minutes=int(AT_TIMEOUT))):
    expiry_date = datetime.now(timezone.utc) + time_delta
    dic_info = {
            "sub": str(uid),
            "exp": expiry_date
            }

    encoded_jwt = jwt.encode(dic_info, SECRET_KEY, ALGORITHM)
    return encoded_jwt

# Verify the Token

def verify_token(token:str = Depends(oauth2_schema), session:Session = Depends(get_session)):
    try:
        dic_info = jwt.decode(token, SECRET_KEY, ALGORITHM)
        user_id = str(dic_info.get("sub"))
    except JWTError as error:
        raise HTTPException(status_code=401, detail="Access Denied")

    usuario = session.query(User).filter(User.id==user_id).first()

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
