from pathlib import Path
from .freshness_analyzer import analyze_freshness

if __name__ == "__main__":
    BASE_DIR = Path(__file__).resolve().parent
    image_path = BASE_DIR / "static" / "test1.png"
    result = analyze_freshness(image_path)
    print(result)



