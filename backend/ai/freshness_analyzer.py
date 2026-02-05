import base64
import json
import os
from xmlrpc import client
from google import genai
from google.genai import types
from google.genai import errors as genai_errors
from pathlib import Path
from .prompt import FRESHNESS_PROMPT
from dotenv import load_dotenv

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY")
if not _api_key:
    raise RuntimeError(
        "GEMINI_API_KEY not set. Export your Gemini API key as the GEMINI_API_KEY environment variable."
    )

client = genai.Client(api_key=_api_key)


def analyze_freshness(image_path: Path) -> dict:
    image_bytes = image_path.read_bytes()

    try:
        response = client.models.generate_content(
            model="models/gemini-1.0-pro-vision",
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(
                            data=image_bytes,
                            mime_type="image/png",
                        ),
                        types.Part.from_text(text=FRESHNESS_PROMPT),
                    ],
                )
            ],
        )

        text = None
        if hasattr(response, "text") and isinstance(response.text, str):
            text = response.text
        else:
            try:
                text = response.candidates[0].content[0].text  # type: ignore
            except Exception:
                try:
                    text = response.to_dict().get("candidates", [{}])[0].get("content", [{}])[0].get("text")
                except Exception:
                    text = str(response)

        text = (text or "").strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {
                "error": "Invalid JSON returned by Gemini",
                "raw_response": text,
                "source": "gemini",
            }

    except genai_errors.ClientError as e:
        # Provide a clearer, actionable message for common issues like missing/unsupported models.
        msg = getattr(e, "message", str(e))
        return {
            "error": "genai_client_error",
            "message": msg,
            "details": e.args,
        }
    except Exception as e:
        return {"error": "unexpected_error", "message": str(e)}