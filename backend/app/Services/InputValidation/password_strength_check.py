import re
from fastapi import HTTPException


def check_pwd_strength(pwd:str):
    has_lower = any(filter(str.islower, pwd))
    has_upper = any(filter(str.isupper, pwd))
    has_both = has_upper and has_lower

    match_object = re.fullmatch(r"^[a-zA-Z0-9#@$?!]*$", pwd)

    if len(pwd) < 8:
        raise HTTPException(status_code=400, detail="Password too short.")
    if not match_object:
        raise HTTPException(status_code=400, detail="There are invalid characters in your password.")
    if not has_both:
        raise HTTPException(status_code=400, detail="Password needs both lower and uppercase letters.")
