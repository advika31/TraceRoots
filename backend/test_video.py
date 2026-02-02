from utils.video_utils import generate_video

class DummyOwner:
    full_name = "Rajesh Kumar"

class DummyBatch:
    batch_id = "demo123"
    crop_name = "Wheat"
    region = "Punjab"
    ai_quality_score = 92
    owner = DummyOwner()

audio_path = "static/audio/batch_demo123.mp3"

video_path = generate_video(DummyBatch(), audio_path)
print("Video generated:", video_path)
