from tokenizers import Tokenizer
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOKENIZER_DIR = os.path.join(SCRIPT_DIR, 'tokenizers')
SAMPLES_DIR = os.path.join(SCRIPT_DIR, 'samples')

TOKENIZER_NAME = "qwen3-4b-tokenizer"
ALL_TOKENIZERS = {}

if not os.path.isdir(TOKENIZER_DIR):
    print(f"❌ Error: Tokenizer directory not found at {TOKENIZER_DIR}")
    exit(1)

for filename in os.listdir(TOKENIZER_DIR):
    if filename.endswith('.json'):
        key = filename[:-5]  # remove .json
        full_path = os.path.join(TOKENIZER_DIR, filename)
        try:
            ALL_TOKENIZERS[key] = Tokenizer.from_file(full_path)
        except Exception as e:
            print(f"❌ Error loading tokenizer '{key}' from '{full_path}': {e}")


if TOKENIZER_NAME not in ALL_TOKENIZERS:
    print(f"❌ Error: Tokenizer '{TOKENIZER_NAME}' not found in {TOKENIZER_DIR}")
    exit(1)

tokenizer = ALL_TOKENIZERS[TOKENIZER_NAME]
print(f"✅ Successfully loaded tokenizer: {TOKENIZER_NAME}")

SAMPLE_NAME = 'arch'

sample_data = {}
results = {}

file_path_json = os.path.join(SAMPLES_DIR, f"{SAMPLE_NAME}.json")
try:
    with open(file_path_json, "r", encoding="utf-8") as f:
        sample_data['json'] = f.read()
except FileNotFoundError as e:
    print(f"⚠️ Warning: Could not find file '{SAMPLE_NAME}.json'. Skipping. Details: {e}")
    sample_data['json'] = ""

file_path_nows = os.path.join(SAMPLES_DIR, f"{SAMPLE_NAME}-nows.json")
try:
    with open(file_path_nows, "r", encoding="utf-8") as f:
        sample_data['nows-json'] = f.read()
except FileNotFoundError as e:
    print(f"⚠️ Warning: Could not find file '{SAMPLE_NAME}-nows.json'. Skipping. Details: {e}")
    sample_data['nows-json'] = ""

file_path_toon = os.path.join(SAMPLES_DIR, f"{SAMPLE_NAME}.toon")
try:
    with open(file_path_toon, "r", encoding="utf-8") as f:
        sample_data['toon'] = f.read()
except FileNotFoundError as e:
    print(f"⚠️ Warning: Could not find file '{SAMPLE_NAME}.toon'. Skipping. Details: {e}")
    sample_data['toon'] = ""

file_path_yaml = os.path.join(SAMPLES_DIR, f"{SAMPLE_NAME}.yaml")
try:
    with open(file_path_yaml, "r", encoding="utf-8") as f:
        sample_data['yaml'] = f.read()
except FileNotFoundError as e:
    print(f"⚠️ Warning: Could not find file '{SAMPLE_NAME}.yaml'. Skipping. Details: {e}")
    sample_data['yaml'] = ""

if all(value == "" for value in sample_data.values()):
     print(f"--- 🚫 Skipping sample '{SAMPLE_NAME}': All required files are missing. ---")
else:
    try:
        encoded_json = tokenizer.encode(sample_data.get('json', ''))
        encoded_nows_json = tokenizer.encode(sample_data.get('nows-json', ''))

        encoded_toon = tokenizer.encode(sample_data.get('toon', ''))
        encoded_yaml = tokenizer.encode(sample_data.get('yaml', ''))

        results[SAMPLE_NAME] = {
            'json': len(encoded_json.ids),
            'nows-json': len(encoded_nows_json.ids),
            'yaml': len(encoded_yaml.ids),
            'toon': len(encoded_toon.ids),
        }

    except Exception as e:
        print(f"❌ Critical Error processing sample '{SAMPLE_NAME}' during tokenization: {e}")


print("\n" + "="*50)
print(f"Tokenizer: {TOKENIZER_NAME}")
print("="*50)

if SAMPLE_NAME in results:
    counts = results[SAMPLE_NAME]
    print(f"--- Sample: {SAMPLE_NAME} ---")
    print(f"Liczba tokenów json: {counts['json']}")
    print(f"Liczba tokenów nows-json: {counts['nows-json']}")
    print(f"Liczba tokenów yaml: {counts['yaml']}")
    print(f"Liczba tokenów toon: {counts['toon']}")