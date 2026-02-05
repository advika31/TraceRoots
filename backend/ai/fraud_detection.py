from PIL import Image
from PIL.ExifTags import TAGS
from datetime import datetime, timedelta


MAX_YIELD_PER_ACRE = {
    "saffron": 3,     # kg per acre
    "wheat": 1200,    # kg per acre
    "apple": 8000
}

VALID_REGIONS = {
    "saffron": ["Jammu & Kashmir"],
    "apple": ["Himachal Pradesh", "Jammu & Kashmir"],
    "wheat": ["Punjab", "Haryana"]
}

def check_crop_location(crop, location):
    crop = crop.lower()
    location = location.strip()

    if crop not in VALID_REGIONS:
        return False, None  # unknown crop → allow, don’t block

    if location not in VALID_REGIONS[crop]:
        return True, f"{crop.title()} cannot be grown in {location}"

    return False, None

def check_yield(crop, quantity_kg, land_area_acres):
    crop = crop.lower()

    if crop not in MAX_YIELD_PER_ACRE:
        return False, None

    max_allowed = MAX_YIELD_PER_ACRE[crop] * land_area_acres

    if quantity_kg > max_allowed:
        return True, (
            f"Reported quantity {quantity_kg}kg exceeds "
            f"expected max {max_allowed}kg for {land_area_acres} acres"
        )

    return False, None


def extract_exif(image_path):
    image = Image.open(image_path)
    exif_raw = image._getexif()

    if not exif_raw:
        return None

    exif = {}
    for tag, value in exif_raw.items():
        tag_name = TAGS.get(tag, tag)
        exif[tag_name] = value

    return exif


def check_exif(image_path):
    exif = extract_exif(image_path)

    if not exif:
        return True, "No EXIF metadata found"

    if "Make" not in exif:
        return True, "Camera make missing"

    if "DateTime" in exif:
        photo_time = datetime.strptime(exif["DateTime"], "%Y:%m:%d %H:%M:%S")
        if datetime.now() - photo_time > timedelta(days=7):
            return True, "Photo is too old"

    return False, None

def run_fraud_checks(data, image_path):
    flags = []

    checks = [
        check_crop_location(data["crop"], data["location"]),
        check_yield(data["crop"], data["quantity_kg"], data["land_area"]),
        check_exif(image_path)
    ]

    for is_fraud, reason in checks:
        if is_fraud:
            flags.append(reason)

    return {
        "fraud_flag": len(flags) > 0,
        "reasons": flags
    }
    
if __name__ == "__main__":
    # Example usage
    data = {
        "crop": "Saffron",
        "quantity_kg": 5,
        "land_area": 1,
        "location": "Punjab"
    }
    image_path = "backend/ai/static/test1.png"
    result = run_fraud_checks(data, image_path)
    print(result)
