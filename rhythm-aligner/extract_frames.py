import os
import re
import subprocess

# Paths
base_dir = os.path.dirname(os.path.abspath(__file__))
video_dir = os.path.join(base_dir, "tiktok_videos")
output_dir = os.path.join(base_dir, "tiktok_frames")
os.makedirs(output_dir, exist_ok=True)

# Sanitize filenames for folder use
def sanitize_filename(name):
    name = re.sub(r'[^\w\s-]', '', name, flags=re.UNICODE)
    name = re.sub(r'\s+', '_', name.strip().lower())
    return name

# Frame extraction config
FPS = 1

# Loop through all videos
for video_file in os.listdir(video_dir):
    if not video_file.endswith(".mp4"):
        continue

    input_path = os.path.join(video_dir, video_file)
    safe_name = sanitize_filename(os.path.splitext(video_file)[0])
    frame_folder = os.path.join(output_dir, safe_name)
    os.makedirs(frame_folder, exist_ok=True)

    output_pattern = os.path.join(frame_folder, "frame_%03d.jpg")

    print(f"Extracting frames from: {video_file} -> {safe_name}/")
    try:
        subprocess.run([
            "ffmpeg", "-i", input_path,
            "-vf", f"fps={FPS}",
            output_pattern
        ], check=True)
    except subprocess.CalledProcessError:
        print(f"Failed to extract frames from: {video_file}")

print("\nAll extractable frames have been processed.")
