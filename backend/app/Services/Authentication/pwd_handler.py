import bcrypt

def hash_password(password: str) -> str:
    """password hashing using bcrypt"""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_pwd:str, hashed_pwd:str) -> bool:
    """verify a password against its hash with bcrypt"""
    return bcrypt.checkpw(
            plain_pwd.encode("utf-8"),
            hashed_pwd.encode("utf-8")
            )
