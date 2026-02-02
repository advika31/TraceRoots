from moviepy.video.io.VideoFileClip import VideoFileClip

clip = VideoFileClip("static/generated_videos/batch_demo123.mp4")

print("Has audio:", clip.audio is not None)
if clip.audio:
    print("Audio duration:", clip.audio.duration)

clip.close()
