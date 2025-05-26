# RemixMate: Vietnamese-to-English Lyrics Translator System

RemixMate is a bilingual lyrics translator and karaoke-sync application designed to translate Vietnamese song lyrics into English, enriched with cultural and contextual insights via the Sonar API. The system ensures rhythmic alignment to maintain flow and offers a karaoke-style sing-along experience with synchronized lyric highlighting.

## Project Overview

This repository contains the code and documentation for RemixMate, developed as part of the Perplexity AI Hackathon.

### Key Features
- Automated Vietnamese-to-English lyric translation
- Enrichment of translations with idiomatic and cultural context via Sonar API
- Rhythmic alignment to preserve syllable count and flow
- Bilingual lyric display with synchronized karaoke highlighting
- Annotation panel displaying Sonar API insights
- Sing-along mode with play/pause controls

## Documentation

- Detailed project planning and research findings are documented in [docs/phase_1_research.md](./docs/phase_1_research.md)
- Wireframe designs and UI prototypes are available in the [docs/wireframes/](./docs/wireframes/) directory

## Getting Started

Instructions for setting up the project, running the backend microservice, and launching the frontend will be provided here.

### Prerequisites

- Python 3.11+
- `ffmpeg` installed and added to system PATH  
  ↳ [Download FFmpeg](https://ffmpeg.org/download.html)

---


### Purpose of Each Script

| Script                        | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| `download_tiktok_videos.py`  | Downloads videos from TikTok based on the list in `tiktok_urls.txt`.       |
| `extract_frames.py`          | Uses FFmpeg to extract one frame per second from each video.               |
| `detect_bad_frames.py`       | Detects duplicate/empty/incomplete lyric frames for manual review.         |
| `extract_lyrics_from_frames.py` | Runs PaddleOCR over selected frames to extract Vietnamese lyrics.        |
| `syllable_aligner.py`        | (Planned) Aligns Vietnamese and English lyrics syllable by syllable.       |

*For detailed feature descriptions, architecture, and development roadmap, please refer to the documentation folder.*


