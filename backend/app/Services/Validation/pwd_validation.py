import re

def validate_password_strength(password:str) -> bool:
    # at least one letter upercase and lowercase
    # at least one number from 0-9
    # at least one symbol from @ $ ! % * # ? &

    final_pattern = r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"

    final_match = re.match(final_pattern, password)
    if not final_match:
        return False
    else:
        return True
