import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )

    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def check_gps_mismatch(user_lat, user_lon, image_lat, image_lon):
    distance = haversine(user_lat, user_lon, image_lat, image_lon)

    if distance > 2:  # km
        return True, f"GPS mismatch: {round(distance,2)} km difference"

    return False, None


def get_decimal_gps(gps_coord):
    d, m, s = gps_coord
    return d + (m / 60) + (s / 3600)


def extract_image_gps(exif):
    if "GPSInfo" not in exif:
        return None, None

    gps = exif["GPSInfo"]

    lat = get_decimal_gps(gps[2])
    lon = get_decimal_gps(gps[4])

    if gps[1] == 'S':
        lat = -lat
    if gps[3] == 'W':
        lon = -lon

    return lat, lon

