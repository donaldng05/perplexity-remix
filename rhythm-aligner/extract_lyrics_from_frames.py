import os
import pytesseract
from PIL import Image

# Set up paths
base_dir = os.path.dirname(os.path.abspath(__file__))
frames_dir = os.path.join(base_dir, "tiktok_frames")
lyrics_dir = os.path.join(base_dir, "failed_lyrics")
os.makedirs(lyrics_dir, exist_ok=True)

def clean_text(text):
    return text.strip().replace("\n", " ").replace("  ", " ")

# Loop through folders
for folder in os.listdir(frames_dir):
    folder_path = os.path.join(frames_dir, folder)
    if not os.path.isdir(folder_path):
        continue

    print(f"Processing: {folder}")
    seen = set()
    last_line = ""
    lyrics = []

    for frame in sorted(os.listdir(folder_path)):
        if not frame.endswith(".jpg"):
            continue

        frame_path = os.path.join(folder_path, frame)
        img = Image.open(frame_path)
        raw_text = pytesseract.image_to_string(img, lang="vie")
        cleaned = clean_text(raw_text)

        if not cleaned or cleaned.lower() == last_line.lower():
            continue  # skip empty or repeated lines

        lyrics.append(cleaned)
        last_line = cleaned

    # Write to .txt
    out_path = os.path.join(lyrics_dir, f"{folder}.txt")
    with open(out_path, "w", encoding="utf-8") as f:
        for line in lyrics:
            f.write(line + "\n")

    print(f"Saved: {out_path}")

print("\nAll done! Lyrics saved to failed_lyrics/")
