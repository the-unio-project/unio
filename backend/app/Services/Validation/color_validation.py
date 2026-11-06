import re

def validate_color(color:str) -> bool:
    pattern = r"^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$"
    match = re.match(pattern, color)

    if not match:
        return False

    return True
