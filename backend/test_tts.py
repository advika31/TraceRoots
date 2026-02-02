from utils.tts_utils import generate_voiceover

audio_path = generate_voiceover(
    "This wheat was grown by a verified farmer in Punjab and secured on blockchain.",
    "demo123"
)

print("Generated:", audio_path)
