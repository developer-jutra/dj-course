from tokenizers import Tokenizer
from corpora import get_corpus_file

TOKENIZERS = {
    "bpe": "tokenizers/bpe_tokenizer.json",
    "bielik-v1": "tokenizers/bielik-v1-tokenizer.json",
    "bielik-v2": "tokenizers/bielik-v2-tokenizer.json",
    "bielik-v3": "tokenizers/bielik-v3-tokenizer.json",
}
TOKENIZER = "bielik-v3"

tokenizer = Tokenizer.from_file(TOKENIZERS[TOKENIZER])

source_txt = ""
with open(get_corpus_file("WOLNELEKTURY", "pan-tadeusz-ksiega-*.txt")[0], 'r', encoding='utf-8') as f:
    source_txt = f.read()

encoded = tokenizer.encode(source_txt)

file_name = f"logs/tokenized-Pan-Tadeusz-{TOKENIZER}.log"
with open(file_name, 'w', encoding='utf-8') as f:
    f.write(f"Liczba tokenów: {len(encoded.ids)}\n")
    f.write(f"Tokenizer: {TOKENIZER}\n")
    print(f"Tokenizer: {TOKENIZER}")
    print(f"Liczba tokenów: {len(encoded.ids)}")