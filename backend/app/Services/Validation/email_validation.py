import re

def validate_email(email:str) -> bool:
    pattern = r"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
    match = re.match(pattern, email)

    if not match:
        return False

    return True
