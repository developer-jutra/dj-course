"""
Cross-tokenization comparison script.
Tests multiple texts with all available tokenizers and generates statistics.
"""
import json
from pathlib import Path
from tokenizers import Tokenizer
from typing import Dict, List, Tuple
import glob

# Reference texts
REFERENCE_TEXTS = {
    "Pan Tadeusz - Księga 1": "../korpus-wolnelektury/pan-tadeusz-ksiega-1.txt",
    "The Pickwick Papers": "../korpus-mini/the-pickwick-papers-gutenberg.txt",
    "Fryderyk Chopin": "../korpus-mini/fryderyk-chopin-wikipedia.txt",
}

def load_text(filepath: str) -> str:
    """Load text from file."""
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Text file not found: {filepath}")
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def load_tokenizer(tokenizer_path: str) -> Tokenizer:
    """Load a tokenizer from JSON file."""
    return Tokenizer.from_file(tokenizer_path)

def tokenize_text(tokenizer: Tokenizer, text: str) -> Tuple[int, List[str]]:
    """
    Tokenize text and return token count and sample tokens.
    
    Returns:
        Tuple of (token_count, first_100_tokens)
    """
    encoded = tokenizer.encode(text)
    return len(encoded.tokens), encoded.tokens[:100]

def main():
    # Find all tokenizers
    tokenizer_files = glob.glob("tokenizers/*.json")
    tokenizer_files.sort()
    
    if not tokenizer_files:
        print("No tokenizer files found in tokenizers/ directory!")
        return
    
    print("="*80)
    print("CROSS-TOKENIZATION COMPARISON")
    print("="*80)
    print(f"\nFound {len(tokenizer_files)} tokenizers:")
    for tf in tokenizer_files:
        print(f"  - {Path(tf).name}")
    
    print(f"\nTesting {len(REFERENCE_TEXTS)} reference texts:")
    for name in REFERENCE_TEXTS:
        print(f"  - {name}")
    print()
    
    # Results storage
    results = {}
    
    # Load texts
    texts = {}
    for text_name, text_path in REFERENCE_TEXTS.items():
        try:
            texts[text_name] = load_text(text_path)
            char_count = len(texts[text_name])
            word_count = len(texts[text_name].split())
            print(f"Loaded '{text_name}': {char_count:,} chars, ~{word_count:,} words")
        except FileNotFoundError as e:
            print(f"✗ Error: {e}")
            return
    
    print("\n" + "="*80)
    print("TOKENIZATION RESULTS")
    print("="*80)
    
    # For each text
    for text_name, text_content in texts.items():
        print(f"\n{'='*80}")
        print(f"TEXT: {text_name}")
        print(f"{'='*80}")
        
        text_results = {}
        
        # Test with each tokenizer
        for tokenizer_file in tokenizer_files:
            tokenizer_name = Path(tokenizer_file).stem
            
            try:
                tokenizer = load_tokenizer(tokenizer_file)
                token_count, sample_tokens = tokenize_text(tokenizer, text_content)
                text_results[tokenizer_name] = token_count
                
                print(f"\n{tokenizer_name}:")
                print(f"  Token count: {token_count:,}")
                print(f"  First 20 tokens: {sample_tokens[:20]}")
                
            except Exception as e:
                print(f"\n{tokenizer_name}:")
                print(f"  ✗ Error: {e}")
                text_results[tokenizer_name] = None
        
        # Find the most efficient tokenizer for this text
        valid_results = {k: v for k, v in text_results.items() if v is not None}
        if valid_results:
            best_tokenizer = min(valid_results, key=valid_results.get)
            best_count = valid_results[best_tokenizer]
            
            print(f"\n{'→'*40}")
            print(f"🏆 MOST EFFICIENT for '{text_name}': {best_tokenizer}")
            print(f"   Token count: {best_count:,}")
            print(f"{'→'*40}")
        
        results[text_name] = text_results
    
    # Final summary
    print("\n" + "="*80)
    print("SUMMARY - Most Efficient Tokenizer per Text")
    print("="*80)
    
    for text_name, text_results in results.items():
        valid_results = {k: v for k, v in text_results.items() if v is not None}
        if valid_results:
            best_tokenizer = min(valid_results, key=valid_results.get)
            best_count = valid_results[best_tokenizer]
            
            # Calculate compression ratios vs worst
            worst_tokenizer = max(valid_results, key=valid_results.get)
            worst_count = valid_results[worst_tokenizer]
            compression_ratio = (worst_count - best_count) / worst_count * 100
            
            print(f"\n{text_name}:")
            print(f"  🏆 Best: {best_tokenizer} → {best_count:,} tokens")
            print(f"  Worst: {worst_tokenizer} → {worst_count:,} tokens")
            print(f"  Improvement: {compression_ratio:.1f}% fewer tokens")
    
    # Save detailed results to JSON
    output_file = "tokenizer-comparison-results.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\n✓ Detailed results saved to: {output_file}")
    
    # Create a comparison table
    print("\n" + "="*80)
    print("COMPARISON TABLE")
    print("="*80)
    print()
    
    # Header
    tokenizer_names = [Path(tf).stem for tf in tokenizer_files]
    print(f"{'Text':<30} | ", end="")
    for tn in tokenizer_names:
        print(f"{tn[:15]:>15} | ", end="")
    print()
    print("-" * (32 + len(tokenizer_names) * 18))
    
    # Rows
    for text_name, text_results in results.items():
        print(f"{text_name[:29]:<30} | ", end="")
        for tn in tokenizer_names:
            count = text_results.get(tn, None)
            if count is not None:
                print(f"{count:>15,} | ", end="")
            else:
                print(f"{'ERROR':>15} | ", end="")
        print()
    
    print("\n" + "="*80)

if __name__ == "__main__":
    main()
