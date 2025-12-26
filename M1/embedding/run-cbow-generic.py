from corpora import CORPORA_FILES # type: ignore
from training import run_training
from inferring import run_inferring

KEY = "ALL"
# KEY = "WOLNELEKTURY"
# KEY = "PAN_TADEUSZ"

# TOKENIZER_FILE = "../tokenizer/tokenizers/bert-base-uncased.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v1-tokenizer.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/bielik-v3-tokenizer.json"
TOKENIZER_FILE = "../tokenizer/tokenizers/tokenizer-all-corpora.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/tokenizer-nkjp.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/tokenizer-pan-tadeusz.json"
# TOKENIZER_FILE = "../tokenizer/tokenizers/tokenizer-wolnelektury.json"

run_training(KEY, TOKENIZER_FILE)

run_inferring(KEY, TOKENIZER_FILE)
