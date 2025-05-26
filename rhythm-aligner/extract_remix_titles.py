import os
import json
import re
import time
import requests
from dotenv import load_dotenv

# Load .env from backend folder
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
load_dotenv(os.path.join(backend_dir, ".env"))

subscription_key = os.getenv("AZURE_CV_KEY")
endpoint = os.getenv("AZURE_CV_ENDPOINT")

if not endpoint or not subscription_key:
    raise ValueError("Missing Azure endpoint or key. Check the .env file.")

# Image and output setup
base_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(base_dir, "remix_screenshots", "top_8_remix_list.jpg")
output_dir = os.path.join(base_dir, "remix_screenshots")
os.makedirs(output_dir, exist_ok=True)

# Azure Read API
read_url = endpoint.rstrip("/") + "/vision/v3.2/read/analyze"
headers = {
    'Ocp-Apim-Subscription-Key': subscription_key,
    'Content-Type': 'application/octet-stream'
}

print("Calling Azure Read API...")

# Send image to Azure
with open(image_path, "rb") as image_data:
    response = requests.post(read_url, headers=headers, data=image_data)
    response.raise_for_status()
    operation_url = response.headers["Operation-Location"]

# Poll result
print("Waiting for Azure OCR result...")
while True:
    result_response = requests.get(operation_url, headers=headers)
    result = result_response.json()
    status = result.get("status")
    if status == "succeeded":
        break
    elif status == "failed":
        raise Exception("Azure Read API failed to process the image.")
    time.sleep(1)

# Extract all lines
lines = []
for read_result in result["analyzeResult"]["readResults"]:
    for line in read_result["lines"]:
        lines.append(line["text"])

# Clean and parse titles
def clean_title(title):
    title = title.upper()
    title = title.replace('0', 'O').replace('5', 'S')
    title = re.sub(r'[^A-ZÀ-Ỵ0-9\s]', '', title)
    title = re.sub(r'\s{2,}', ' ', title)
    return title.strip()

song_titles = []
for line in lines:
    if any(char.isdigit() for char in line) and '.' in line:
        parts = line.split('.', 1)
        if len(parts) > 1:
            raw_title = parts[1].strip()
            cleaned = clean_title(raw_title)
            if len(cleaned) > 2:
                song_titles.append(cleaned)

# Print results
print("\nExtracted remix titles:")
for i, title in enumerate(song_titles, 1):
    print(f"{i}. {title}")

# Save output
txt_path = os.path.join(output_dir, "extracted_titles.txt")
json_path = os.path.join(output_dir, "extracted_titles.json")

with open(txt_path, "w", encoding="utf-8") as txt_file:
    for title in song_titles:
        txt_file.write(title + "\n")

with open(json_path, "w", encoding="utf-8") as json_file:
    json.dump(song_titles, json_file, ensure_ascii=False, indent=2)

print(f"\nSaved titles to:\n- {txt_path}\n- {json_path}")
