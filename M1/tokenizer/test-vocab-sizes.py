"""
Test the impact of different vocabulary sizes on tokenization efficiency.
"""
import sys
from pathlib import Path
from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.trainers import BpeTrainer
from tokenizers.pre_tokenizers import Whitespace
from corpora import CORPORA_FILES

# Test text - Pan Tadeusz Księga 1
TEST_TEXT_PATH = "../korpus-wolnelektury/pan-tadeusz-ksiega-1.txt"

def load_test_text():
    """Load the test text."""
    with open(TEST_TEXT_PATH, 'r', encoding='utf-8') as f:
        return f.read()

def test_vocab_size(corpus: str, vocab_size: int, test_text: str):
    """
    Build a tokenizer with given vocab size and test it.
    
    Returns:
        Token count for the test text
    """
    output_name = f"test-vocab-{vocab_size}"
    
    try:
        # Get corpus files
        if corpus not in CORPORA_FILES:
            raise ValueError(f"Unknown corpus: {corpus}")
        
        files = CORPORA_FILES[corpus]
        file_paths = [str(f) for f in files]
        
        # Build tokenizer
        tokenizer = Tokenizer(BPE(unk_token="[UNK]"))
        tokenizer.pre_tokenizer = Whitespace()
        
        trainer = BpeTrainer(
            special_tokens=["[UNK]", "[CLS]", "[SEP]", "[PAD]", "[MASK]"],
            vocab_size=vocab_size,
            min_frequency=2
        )
        
        tokenizer.train(file_paths, trainer=trainer)
        
        # Test on our text
        encoded = tokenizer.encode(test_text)
        token_count = len(encoded.tokens)
        
        return token_count
        
    except Exception as e:
        print(f"Error with vocab_size={vocab_size}: {e}")
        return None

def main():
    print("="*80)
    print("VOCABULARY SIZE EXPERIMENT")
    print("="*80)
    
    # Load test text
    test_text = load_test_text()
    char_count = len(test_text)
    word_count = len(test_text.split())
    print(f"\nTest text: Pan Tadeusz - Księga 1")
    print(f"Characters: {char_count:,}")
    print(f"Words: ~{word_count:,}")
    
    # Test different vocab sizes
    vocab_sizes = [8000, 16000, 24000, 32000, 40000, 48000, 64000]
    
    # Test on PAN_TADEUSZ corpus
    corpus = "PAN_TADEUSZ"
    
    print(f"\n{'='*80}")
    print(f"Testing corpus: {corpus}")
    print(f"{'='*80}\n")
    
    results = {}
    
    for vocab_size in vocab_sizes:
        print(f"Testing vocab_size={vocab_size:,}...", end=" ", flush=True)
        token_count = test_vocab_size(corpus, vocab_size, test_text)
        
        if token_count:
            results[vocab_size] = token_count
            print(f"✓ Token count: {token_count:,}")
        else:
            print("✗ Failed")
    
    # Analysis
    print(f"\n{'='*80}")
    print("RESULTS SUMMARY")
    print(f"{'='*80}\n")
    
    print(f"{'Vocab Size':<15} | {'Token Count':<15} | {'vs. Baseline':<15}")
    print("-" * 50)
    
    baseline_vocab = 32000
    baseline_tokens = results.get(baseline_vocab, None)
    
    for vocab_size in vocab_sizes:
        token_count = results.get(vocab_size, None)
        if token_count:
            if baseline_tokens:
                diff_pct = ((token_count - baseline_tokens) / baseline_tokens) * 100
                diff_str = f"{diff_pct:+.1f}%"
            else:
                diff_str = "N/A"
            
            marker = " 🎯" if vocab_size == baseline_vocab else ""
            print(f"{vocab_size:>14,} | {token_count:>14,} | {diff_str:>14}{marker}")
    
    # Find optimal
    if results:
        best_vocab = min(results, key=results.get)
        best_tokens = results[best_vocab]
        
        print(f"\n{'='*80}")
        print(f"🏆 OPTIMAL: vocab_size={best_vocab:,} → {best_tokens:,} tokens")
        print(f"{'='*80}")
        
        if baseline_tokens:
            improvement = ((baseline_tokens - best_tokens) / baseline_tokens) * 100
            print(f"\nImprovement over baseline (32k): {improvement:.1f}%")

if __name__ == "__main__":
    main()
