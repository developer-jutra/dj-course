import argparse
from pathlib import Path
from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.trainers import BpeTrainer
from tokenizers.pre_tokenizers import Whitespace
from corpora import CORPORA_FILES, CORPORA_DIRS

def build_tokenizer(corpus_key: str, output_name: str, vocab_size: int = 32000, min_frequency: int = 2):
    """
    Build a BPE tokenizer from specified corpus.
    
    Args:
        corpus_key: Key from CORPORA_FILES ('PAN_TADEUSZ', 'WOLNELEKTURY', 'NKJP', 'ALL')
        output_name: Name for the output tokenizer file (without .json)
        vocab_size: Size of the vocabulary
        min_frequency: Minimum frequency for tokens
    """
    # Get files for the specified corpus
    if corpus_key not in CORPORA_FILES:
        raise ValueError(f"Unknown corpus: {corpus_key}. Available: {list(CORPORA_FILES.keys())}")
    
    files = CORPORA_FILES[corpus_key]
    if not files:
        raise ValueError(f"No files found for corpus: {corpus_key}")
    
    print(f"\n{'='*60}")
    print(f"Building tokenizer: {output_name}")
    print(f"Corpus: {corpus_key}")
    print(f"Files: {len(files)}")
    print(f"Vocab size: {vocab_size}")
    print(f"Min frequency: {min_frequency}")
    print(f"{'='*60}\n")
    
    # 1. Initialize the Tokenizer (BPE model)
    tokenizer = Tokenizer(BPE(unk_token="[UNK]"))
    
    # 2. Set the pre-tokenizer (e.g., split on spaces)
    tokenizer.pre_tokenizer = Whitespace()
    
    # 3. Set the Trainer
    trainer = BpeTrainer(
        special_tokens=["[UNK]", "[CLS]", "[SEP]", "[PAD]", "[MASK]"],
        vocab_size=vocab_size,
        min_frequency=min_frequency
    )
    
    # Convert Path objects to strings
    file_paths = [str(f) for f in files]
    
    # 4. Train the Tokenizer
    print("Training tokenizer...")
    tokenizer.train(file_paths, trainer=trainer)
    
    # 5. Save the vocabulary and tokenization rules
    output_path = f"tokenizers/{output_name}.json"
    tokenizer.save(output_path)
    print(f"✓ Tokenizer saved to: {output_path}\n")
    
    # 6. Test with sample texts
    test_texts = [
        "Litwo! Ojczyzno moja! ty jesteś jak zdrowie.",
        "Jakże mi wesoło!",
        "Jeśli wolisz mieć pełną kontrolę nad tym, które listy są łączone.",
    ]
    
    print("Testing tokenizer:")
    for txt in test_texts:
        encoded = tokenizer.encode(txt)
        print(f"  Text: {txt}")
        print(f"  Tokens ({len(encoded.tokens)}): {encoded.tokens}")
        print(f"  IDs: {encoded.ids}\n")
    
    return tokenizer

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build custom BPE tokenizers from various corpora")
    parser.add_argument("--corpus", type=str, choices=list(CORPORA_FILES.keys()),
                        help="Corpus to use for training")
    parser.add_argument("--output", type=str,
                        help="Output tokenizer name (without .json extension)")
    parser.add_argument("--vocab-size", type=int, default=32000,
                        help="Vocabulary size (default: 32000)")
    parser.add_argument("--min-freq", type=int, default=2,
                        help="Minimum token frequency (default: 2)")
    parser.add_argument("--all", action="store_true",
                        help="Build all standard tokenizers")
    
    args = parser.parse_args()
    
    if args.all:
        # Build all standard tokenizers
        configs = [
            ("PAN_TADEUSZ", "tokenizer-pan-tadeusz"),
            ("WOLNELEKTURY", "tokenizer-wolnelektury"),
            ("NKJP", "tokenizer-nkjp"),
            ("ALL", "tokenizer-all-corpora"),
        ]
        
        for corpus_key, output_name in configs:
            try:
                build_tokenizer(corpus_key, output_name, args.vocab_size, args.min_freq)
            except Exception as e:
                print(f"✗ Error building {output_name}: {e}\n")
    elif args.corpus and args.output:
        build_tokenizer(args.corpus, args.output, args.vocab_size, args.min_freq)
    else:
        parser.print_help()
        print("\nExamples:")
        print("  python tokenizer-build.py --corpus PAN_TADEUSZ --output tokenizer-pan-tadeusz")
        print("  python tokenizer-build.py --all")
        print("  python tokenizer-build.py --corpus WOLNELEKTURY --output my-tokenizer --vocab-size 16000")
