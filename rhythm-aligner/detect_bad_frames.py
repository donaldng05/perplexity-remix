import os
import pytesseract
from PIL import Image
from collections import defaultdict
import re

# Set paths
base_dir = os.path.dirname(os.path.abspath(__file__))
frames_dir = os.path.join(base_dir, "tiktok_frames")

# Thresholds
MIN_CHAR_THRESHOLD = 6  # below this, likely noise
KARAOKE_HITS_THRESHOLD = 4  # how many karaoke-like patterns to consider a folder karaoke

bad_frames = []
karaoke_folders = []

# Helper: check if text looks like karaoke (split-line formatting)
def is_karaoke_frame(text):
    if len(text.splitlines()) >= 2:
        if any(re.search(r"^\s*[a-zA-Zà-ỹÀ-Ỹ]+\s+[a-zA-Zà-ỹÀ-Ỹ]+", line) for line in text.splitlines()):
            return True
    return False

# Helper: check if text is scrambled or broken
def is_broken_text(text):
    only_letters = re.sub(r"[^a-zA-Zà-ỹÀ-Ỹ]", "", text)
    if len(only_letters) <= MIN_CHAR_THRESHOLD:
        return True
    if len(text.strip().split()) <= 2 and any(len(w) <= 1 for w in text.strip().split()):
        return True
    return False

# Main loop
for folder in os.listdir(frames_dir):
    folder_path = os.path.join(frames_dir, folder)
    if not os.path.isdir(folder_path):
        continue

    karaoke_hits = 0
    folder_bad_frames = []

    for filename in sorted(os.listdir(folder_path)):
        if not filename.endswith(".jpg"):
            continue

        frame_path = os.path.join(folder_path, filename)
        img = Image.open(frame_path)
        text = pytesseract.image_to_string(img, lang="vie").strip()

        if is_karaoke_frame(text):
            karaoke_hits += 1
            continue

        if not text:
            folder_bad_frames.append((folder, filename, "empty"))
        elif is_broken_text(text):
            folder_bad_frames.append((folder, filename, "broken"))
        elif not text.endswith((".", "…", "?", "!", "”", "”.")):
            folder_bad_frames.append((folder, filename, "incomplete"))

    if karaoke_hits >= KARAOKE_HITS_THRESHOLD:
        karaoke_folders.append(folder)
        continue  # skip saving bad frames from karaoke folders

    bad_frames.extend(folder_bad_frames)

# Output
print("\n=== Low Quality Frames ===")
for folder, fname, reason in bad_frames:
    print(f"{folder}/{fname} → {reason}")

print("\n=== Detected Karaoke Folders ===")
for folder in karaoke_folders:
    print(f"{folder}")
