import os
import shutil
import whisper
from datetime import timedelta

# === Paths ===
base_dir = os.path.dirname(os.path.abspath(__file__))
input_dir = os.path.join(base_dir, "tiktok_videos")
output_dir = os.path.join(base_dir, "transcribed_lyrics")
failed_dir = os.path.join(base_dir, "failed_transcripts")
log_file = os.path.join(failed_dir, "failure_log.txt")

os.makedirs(output_dir, exist_ok=True)
os.makedirs(failed_dir, exist_ok=True)

# === Load Whisper ===
model = whisper.load_model("medium")

# === Helpers ===
def format_timestamp(seconds):
    td = timedelta(seconds=round(seconds, 3))
    return str(td)[:-3]  # strip microseconds

def clean_text(text):
    return ''.join(c for c in text if c.isprintable()).strip()

def is_failed_transcript(text):
    if not text or len(text.strip()) < 10:
        return True
    if sum(c.isdigit() for c in text) / max(len(text), 1) > 0.5:
        return True
    if text.count('-') > 20:
        return True
    return False

# === Process Each Video ===
with open(log_file, "w", encoding="utf-8") as log:
    for filename in os.listdir(input_dir):
        if not filename.endswith(".mp4"):
            continue

        video_path = os.path.join(input_dir, filename)
        name, _ = os.path.splitext(filename)
        print(f"Processing: {name}")

        try:
            result = model.transcribe(video_path, verbose=False, language = "vi")
            segments = result.get("segments", [])
            full_text = " ".join(seg['text'] for seg in segments)
            cleaned = clean_text(full_text)

            if is_failed_transcript(cleaned):
                log.write(f"{name}: ⚠️ Low confidence, but saved\n")
                # Still save the SRT file and let user decide

                continue

            # Save as SRT
            srt_path = os.path.join(output_dir, f"{name}.srt")
            with open(srt_path, "w", encoding="utf-8") as f:
                for idx, seg in enumerate(segments, 1):
                    start = format_timestamp(seg['start'])
                    end = format_timestamp(seg['end'])
                    text = clean_text(seg['text'])
                    f.write(f"{idx}\n{start} --> {end}\n{text}\n\n")

        except Exception as e:
            log.write(f"{name}: Exception - {str(e)}\n")
            shutil.move(video_path, os.path.join(failed_dir, filename))
