import re

from fastapi import HTTPException

def assert_email_validity(email:str):
    pattern = r"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
    
    match_object = re.fullmatch(pattern, email)

    if not match_object:
        raise HTTPException(status_code=400, detail="Invalid e-mail")
