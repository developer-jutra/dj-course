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
def create_trainer(vocab_size: int = 32000, min_frequency: int = 2) -> BpeTrainer:
    return BpeTrainer(
        special_tokens=["[UNK]", "[CLS]", "[SEP]", "[PAD]", "[MASK]"],
        vocab_size=vocab_size,
        min_frequency=min_frequency
    )

def build_tokenizer(corpus_name: str, glob_pattern: str = "*.txt", dry_run: bool = True, vocab_size: int = 32000, min_frequency: int = 2):
    if not corpus_name:
        raise ValueError(f"Corpus {corpus_name} not provided")

    FILES = [str(f) for f in get_corpus_file(corpus_name, glob_pattern)]
    print("Ilość plików:", len(FILES))

    TOKENIZER_OUTPUT_FILE = f"tokenizers/tokenizer-{corpus_name.lower().replace("_", "-")}.json"

    if corpus_name == "ALL":
        TOKENIZER_OUTPUT_FILE = f"tokenizers/tokenizer-all-corpora-{str(vocab_size).replace("000","k").lower()}-{str(min_frequency).lower()}x.json"

    if corpus_name == "WOLNELEKTURY" and len(glob_pattern) > len("*.txt"):
        TOKENIZER_OUTPUT_FILE = f"tokenizers/tokenizer-{glob_pattern.replace('-*.txt', '')}.json"

    # 4. Train the Tokenizer
    if not dry_run:
        tokenizer.train(files=FILES, trainer=create_trainer(vocab_size, min_frequency))

    # 5. Save the vocabulary and tokenization rules
    if not dry_run:
        tokenizer.save(TOKENIZER_OUTPUT_FILE)

    print("Tokenizer saved to:", TOKENIZER_OUTPUT_FILE)

if __name__ == "__main__":
    print("\ntokenizer_build:")
    build_tokenizer("WOLNELEKTURY", "pan-tadeusz-*.txt", dry_run=True)
    build_tokenizer("WOLNELEKTURY", "*.txt", dry_run=True)
    build_tokenizer("NKJP", "*.txt", dry_run=True)
    build_tokenizer("ALL", "*.txt", dry_run=False)
    build_tokenizer("ALL", "*.txt", dry_run=False, vocab_size=16000)
    build_tokenizer("ALL", "*.txt", dry_run=False, vocab_size=64000)
    build_tokenizer("ALL", "*.txt", dry_run=False, vocab_size=32000, min_frequency=1)
    build_tokenizer("ALL", "*.txt", dry_run=False, vocab_size=32000, min_frequency=3)
