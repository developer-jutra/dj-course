"""
Download tokenizer from HuggingFace and save it locally.
"""
import argparse
from tokenizers import Tokenizer

def download_tokenizer(model_name: str, output_name: str):
    """
    Download a tokenizer from HuggingFace and save it locally.
    
    Args:
        model_name: HuggingFace model name (e.g., 'sdadas/polish-gpt2-medium')
        output_name: Name for the output file (without .json)
    """
    print(f"\nDownloading tokenizer from: {model_name}")
    
    try:
        # Try to load from HuggingFace
        tokenizer = Tokenizer.from_pretrained(model_name)
        
        output_path = f"tokenizers/{output_name}.json"
        tokenizer.save(output_path)
        print(f"✓ Tokenizer saved to: {output_path}")
        
        # Test with sample text
        test_texts = [
            "Litwo! Ojczyzno moja! ty jesteś jak zdrowie.",
            "Jakże mi wesoło!",
        ]
        
        print("\nTesting tokenizer:")
        for txt in test_texts:
            encoded = tokenizer.encode(txt)
            print(f"  Text: {txt}")
            print(f"  Tokens ({len(encoded.tokens)}): {encoded.tokens}")
            print()
            
    except Exception as e:
        print(f"✗ Error downloading tokenizer: {e}")
        print("\nYou can also manually download from HuggingFace:")
        print(f"  https://huggingface.co/{model_name}/raw/main/tokenizer.json")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download tokenizer from HuggingFace")
    parser.add_argument("--model", type=str, required=True,
                        help="HuggingFace model name (e.g., 'sdadas/polish-gpt2-medium')")
    parser.add_argument("--output", type=str, required=True,
                        help="Output tokenizer name (without .json extension)")
    
    args = parser.parse_args()
    download_tokenizer(args.model, args.output)
