import os
import subprocess

# Determine this script's folder
base_dir = os.path.dirname(os.path.abspath(__file__))

# Config paths
URL_FILE = os.path.join(base_dir, "tiktok_urls.txt")
OUTPUT_DIR = os.path.join(base_dir, "tiktok_videos")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load URLs from file (support key=value format)
urls = []
with open(URL_FILE, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line or "=" not in line:
            continue
        _, url = line.split("=", 1)
        urls.append(url.strip())

# Download each TikTok video
for url in urls:
    print(f"Downloading: {url}")
    try:
        subprocess.run([
            "yt-dlp",
            "-o", f"{OUTPUT_DIR}/%(title)s.%(ext)s",
            url
        ], check=True)
    except subprocess.CalledProcessError:
        print(f"Failed to download: {url}")

print("\nAll downloads attempted.")
