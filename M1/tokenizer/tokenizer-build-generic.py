from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.trainers import BpeTrainer
from tokenizers.pre_tokenizers import Whitespace
from corpora import get_corpus_file

# 1. Initialize the Tokenizer (BPE model)
tokenizer = Tokenizer(BPE(unk_token="[UNK]"))

# 2. Set the pre-tokenizer (e.g., split on spaces)
tokenizer.pre_tokenizer = Whitespace()

# 3. Set the Trainer
trainer = BpeTrainer(
    special_tokens=["[UNK]", "[CLS]", "[SEP]", "[PAD]", "[MASK]"],
    vocab_size=32000,
    min_frequency=2
)

def build_tokenizer(corpus_name: str, glob_pattern: str = "*.txt", dry_run: bool = True):
    if not corpus_name:
        raise ValueError(f"Corpus {corpus_name} not provided")

    FILES = [str(f) for f in get_corpus_file(corpus_name, glob_pattern)]
    print("Ilość plików:", len(FILES))

    TOKENIZER_OUTPUT_FILE = f"tokenizers/tokenizer-{corpus_name.lower().replace("_", "-")}.json"

    if corpus_name == "ALL":
        TOKENIZER_OUTPUT_FILE = f"tokenizers/tokenizer-all-corpora.json"

    if corpus_name == "WOLNELEKTURY" and len(glob_pattern) > len("*.txt"):
        TOKENIZER_OUTPUT_FILE = f"tokenizers/tokenizer-{glob_pattern.replace('-*.txt', '')}.json"

    # 4. Train the Tokenizer
    if not dry_run:
        tokenizer.train(files=FILES, trainer=trainer)

    # 5. Save the vocabulary and tokenization rules
    if not dry_run:
        tokenizer.save(TOKENIZER_OUTPUT_FILE)

    print("Tokenizer saved to:", TOKENIZER_OUTPUT_FILE)

if __name__ == "__main__":
    print("\ntokenizer_build:")
    build_tokenizer("WOLNELEKTURY", "pan-tadeusz-*.txt", dry_run=False)
    build_tokenizer("WOLNELEKTURY", "*.txt", dry_run=False)
    build_tokenizer("NKJP", "*.txt", dry_run=False)
    build_tokenizer("ALL", "*.txt", dry_run=False)
