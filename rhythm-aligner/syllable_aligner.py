import pyphen
import sys
import json

def count_syllables(text, lang='en'):
    if lang == 'vi':
        try:
            from underthesea import word_tokenize
            return len(word_tokenize(text))
        except ImportError:
            print("underthesea not installed, falling back to pyphen 'en'")
            lang = 'en'

    try:
        dic = pyphen.Pyphen(lang=lang)
    except KeyError:
        print(f"WARNING: Language '{lang}' not supported. Falling back to English.")
        dic = pyphen.Pyphen(lang='en')

    words = text.split()
    return sum(word.count('-') + 1 for word in [dic.inserted(w) for w in words])

def alignment_score(src, tgt):
    if src == 0:
        return 0.0
    return round(1 - abs(src - tgt) / src, 2)

if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    original = data["original"]
    translated = data["translated"]

    src_count = count_syllables(original, 'vi')
    tgt_count = count_syllables(translated, 'en')
    score = alignment_score(src_count, tgt_count)

    suggestion = None
    if score < 0.7:
        suggestion = f"This translation may not match the original rhythm. Consider rephrasing to better match syllable count ({src_count} vs {tgt_count})."

    output = {
        "original_syllables": src_count,
        "translated_syllables": tgt_count,
        "alignment_score": score,
        "suggestion": suggestion
    }

    print(json.dumps(output))
