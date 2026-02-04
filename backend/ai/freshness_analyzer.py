import base64
import json
import os
from openai import OpenAI
from pathlib import Path
from .prompt import FRESHNESS_PROMPT

client = OpenAI(api_key= os.getenv("OPENAI_API_KEY"))

def analyze_freshness(image_path: Path) -> dict:
    """Analyze the freshness of a crop image using OpenAI's API."""
    with open(image_path, "rb") as img_file:
        img_bytes = img_file.read()
    img_b64 = base64.b64encode(img_bytes).decode("utf-8")

    prompt = FRESHNESS_PROMPT + f'\nImage (base64): """{img_b64}"""'

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert agricultural quality inspector."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.2,
    )

    try:
        content = response.choices[0].message.content
        result = json.loads(content)
        return result
    except (json.JSONDecodeError, KeyError) as e:
        raise ValueError("Failed to parse freshness analysis response") from e
    
    contents = response.choices[0].message.content
    return json.loads(contents)