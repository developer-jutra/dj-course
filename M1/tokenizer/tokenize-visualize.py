import os
import json
from tokenizers import Tokenizer

TEXT_TO_TOKENIZE = "Witaj Świecie, co cię w plecy gniecie? Spacje są kluczowe!" 
TOKENIZER_PATH = "tokenizers/custom_bpe_tokenizer.json"

def visualize_tokens_with_gaps(text: str, encoding):
    tokens = encoding.tokens
    offsets = encoding.offsets
    
    print("\n" + "="*50)
    print(f"Oryginalny Tekst: '{text}'")
    print("="*50)

    visualized_sequence = []
    last_end_index = 0

    for i in range(len(tokens)):
        token = tokens[i]
        start, end = offsets[i]
        
        if start > last_end_index:
            gap = text[last_end_index:start]
            visualized_sequence.append(f"[GAP:'{gap}']")
        
        display_token = token
        if token.startswith(' '): 
            display_token = f"TOKEN_BPE:'{token.lstrip(' ')}'"
        elif token.startswith('##'):
            display_token = f"TOKEN_WP_CONT:'{token.lstrip('##')}'"
        else:
             display_token = f"TOKEN:'{token}'"

        visualized_sequence.append(display_token)

        last_end_index = end

    if last_end_index < len(text):
         visualized_sequence.append(f"[GAP_END:'{text[last_end_index:]}']")

    print("Wizualizacja (ciąg tokenów i luk):")
    print(" ".join(visualized_sequence))
    print("="*50)

def main():
    if not os.path.exists(TOKENIZER_PATH):
        print(f"Błąd: Plik tokenizera nie został znaleziony pod ścieżką: {TOKENIZER_PATH}")
        print("Upewnij się, że plik 'bielik-v3-tokenizer.json' znajduje się w tym samym katalogu.")
        return

    try:
        # Ładowanie istniejącego tokenizera z pliku JSON
        tokenizer = Tokenizer.from_file(TOKENIZER_PATH)
        print(f"Pomyślnie załadowano tokenizer z: {TOKENIZER_PATH}")
    except Exception as e:
        print(f"Błąd podczas ładowania tokenizera: {e}")
        return
    
    # Tokenizacja tekstu
    encoding = tokenizer.encode(TEXT_TO_TOKENIZE)
    
    # Wstępne wypisanie wyników
    print(f"\nWyniki Tokenizacji:")
    print(f"Tokeny: {encoding.tokens}")
    print(f"Offsets: {encoding.offsets}")
    
    # Użycie funkcji wizualizującej
    visualize_tokens_with_gaps(TEXT_TO_TOKENIZE, encoding)

if __name__ == "__main__":
    main()