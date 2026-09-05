"""
Skrypt do przeglądania i analizowania rejestru treningów Doc2Vec.

Użycie:
    python view-training-registry.py              # Pokaż wszystkie treningi
    python view-training-registry.py --best       # Pokaż najlepsze treningi
    python view-training-registry.py --compare    # Porównaj parametry
"""

import json
import sys
from pathlib import Path
from datetime import datetime

REGISTRY_FILE = "doc2vec_training_registry.json"

def load_registry():
    """Wczytaj rejestr treningów."""
    if not Path(REGISTRY_FILE).exists():
        print(f"✗ Nie znaleziono pliku rejestru: {REGISTRY_FILE}")
        print(f"  Uruchom najpierw run-doc2vec.py aby stworzyć rejestr!")
        sys.exit(1)
    
    with open(REGISTRY_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def format_time(seconds):
    """Formatuj czas w sekundach na czytelny format."""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        return f"{seconds/60:.1f}min"
    else:
        return f"{seconds/3600:.1f}h"

def show_all_trainings(registry):
    """Wyświetl wszystkie treningi."""
    print(f"\n{'='*100}")
    print(f"REJESTR TRENINGÓW DOC2VEC - Wszystkie wpisy ({len(registry)} total)")
    print(f"{'='*100}\n")
    
    if not registry:
        print("  Rejestr jest pusty. Uruchom run-doc2vec.py aby dodać wpisy.")
        return
    
    for entry in registry:
        run_id = entry['run_id']
        timestamp = datetime.fromisoformat(entry['timestamp']).strftime("%Y-%m-%d %H:%M:%S")
        corpus = entry['corpus']['name']
        tokenizer = entry['tokenizer']
        params = entry['parameters']
        quality = entry['quality_metrics']
        training_time = entry['training_time_seconds']
        
        print(f"{'─'*100}")
        print(f"🔍 Run ID: {run_id} | Data: {timestamp}")
        print(f"{'─'*100}")
        print(f"Korpus: {corpus} ({entry['corpus']['sentences_count']:,} zdań, "
              f"śr. {entry['corpus']['avg_tokens_per_sentence']:.1f} tokenów/zdanie)")
        print(f"Tokenizer: {tokenizer}")
        print(f"\nParametry:")
        print(f"  VECTOR_LENGTH={params['VECTOR_LENGTH']}, "
              f"WINDOW_SIZE={params['WINDOW_SIZE']}, "
              f"MIN_COUNT={params['MIN_COUNT']}, "
              f"EPOCHS={params['EPOCHS']}, "
              f"WORKERS={params['WORKERS']}")
        print(f"\nWyniki:")
        print(f"  • Czas treningu: {format_time(training_time)}")
        print(f"  • Jakość embeddingu: {quality['quality_rating'].upper()} "
              f"(śr. podobieństwo: {quality['avg_top1_similarity']:.4f})")
        print()

def show_best_trainings(registry):
    """Wyświetl najlepsze treningi według jakości."""
    print(f"\n{'='*100}")
    print(f"TOP TRENINGI - Posortowane według jakości embeddingu")
    print(f"{'='*100}\n")
    
    if not registry:
        print("  Rejestr jest pusty. Uruchom run-doc2vec.py aby dodać wpisy.")
        return
    
    # Sortuj według jakości (avg_top1_similarity)
    sorted_registry = sorted(
        registry, 
        key=lambda x: x['quality_metrics']['avg_top1_similarity'], 
        reverse=True
    )
    
    print(f"{'Rank':<6} {'Run ID':<8} {'Quality':<12} {'Similarity':<12} {'Time':<10} "
          f"{'Corpus':<15} {'Params':<40}")
    print(f"{'─'*100}")
    
    for rank, entry in enumerate(sorted_registry, 1):
        run_id = entry['run_id']
        quality = entry['quality_metrics']
        similarity = quality['avg_top1_similarity']
        quality_rating = quality['quality_rating']
        training_time = format_time(entry['training_time_seconds'])
        corpus = entry['corpus']['name']
        params = entry['parameters']
        
        # Emoji dla jakości
        if quality_rating == "excellent":
            emoji = "🥇"
        elif quality_rating == "good":
            emoji = "🥈"
        elif quality_rating == "fair":
            emoji = "🥉"
        else:
            emoji = "○"
        
        params_str = f"V={params['VECTOR_LENGTH']} W={params['WINDOW_SIZE']} E={params['EPOCHS']}"
        
        print(f"{rank:<6} {run_id:<8} {emoji} {quality_rating:<9} {similarity:<12.4f} "
              f"{training_time:<10} {corpus:<15} {params_str:<40}")

def compare_parameters(registry):
    """Porównaj wpływ parametrów na jakość."""
    print(f"\n{'='*100}")
    print(f"ANALIZA PARAMETRÓW - Wpływ na jakość embeddingu")
    print(f"{'='*100}\n")
    
    if not registry:
        print("  Rejestr jest pusty. Uruchom run-doc2vec.py aby dodać wpisy.")
        return
    
    # Analiza VECTOR_LENGTH
    print("📊 Wpływ VECTOR_LENGTH na jakość:")
    vector_groups = {}
    for entry in registry:
        vl = entry['parameters']['VECTOR_LENGTH']
        if vl not in vector_groups:
            vector_groups[vl] = []
        vector_groups[vl].append(entry['quality_metrics']['avg_top1_similarity'])
    
    for vl in sorted(vector_groups.keys()):
        avg = sum(vector_groups[vl]) / len(vector_groups[vl])
        print(f"  VECTOR_LENGTH={vl:3d}: śr. podobieństwo = {avg:.4f} ({len(vector_groups[vl])} treningów)")
    
    # Analiza EPOCHS
    print("\n📊 Wpływ EPOCHS na jakość:")
    epoch_groups = {}
    for entry in registry:
        ep = entry['parameters']['EPOCHS']
        if ep not in epoch_groups:
            epoch_groups[ep] = []
        epoch_groups[ep].append(entry['quality_metrics']['avg_top1_similarity'])
    
    for ep in sorted(epoch_groups.keys()):
        avg = sum(epoch_groups[ep]) / len(epoch_groups[ep])
        print(f"  EPOCHS={ep:3d}: śr. podobieństwo = {avg:.4f} ({len(epoch_groups[ep])} treningów)")
    
    # Analiza WINDOW_SIZE
    print("\n📊 Wpływ WINDOW_SIZE na jakość:")
    window_groups = {}
    for entry in registry:
        ws = entry['parameters']['WINDOW_SIZE']
        if ws not in window_groups:
            window_groups[ws] = []
        window_groups[ws].append(entry['quality_metrics']['avg_top1_similarity'])
    
    for ws in sorted(window_groups.keys()):
        avg = sum(window_groups[ws]) / len(window_groups[ws])
        print(f"  WINDOW_SIZE={ws:3d}: śr. podobieństwo = {avg:.4f} ({len(window_groups[ws])} treningów)")
    
    # Rekomendacje
    print(f"\n{'='*100}")
    print("🎯 REKOMENDACJE:")
    print(f"{'='*100}")
    
    # Najlepszy VECTOR_LENGTH
    best_vl = max(vector_groups.items(), key=lambda x: sum(x[1])/len(x[1]))
    print(f"  • Najlepszy VECTOR_LENGTH: {best_vl[0]} (śr. {sum(best_vl[1])/len(best_vl[1]):.4f})")
    
    # Najlepszy EPOCHS
    best_ep = max(epoch_groups.items(), key=lambda x: sum(x[1])/len(x[1]))
    print(f"  • Najlepszy EPOCHS: {best_ep[0]} (śr. {sum(best_ep[1])/len(best_ep[1]):.4f})")
    
    # Najlepszy WINDOW_SIZE
    best_ws = max(window_groups.items(), key=lambda x: sum(x[1])/len(x[1]))
    print(f"  • Najlepszy WINDOW_SIZE: {best_ws[0]} (śr. {sum(best_ws[1])/len(best_ws[1]):.4f})")

def show_usage():
    """Wyświetl instrukcje użycia."""
    print("""
Użycie:
    python view-training-registry.py              # Pokaż wszystkie treningi
    python view-training-registry.py --best       # Pokaż najlepsze treningi
    python view-training-registry.py --compare    # Porównaj parametry
    python view-training-registry.py --help       # Pokaż tę pomoc
    """)

def main():
    """Główna funkcja."""
    # Parsuj argumenty
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg in ['--help', '-h']:
            show_usage()
            return
    
    # Wczytaj rejestr
    registry = load_registry()
    
    # Wybierz tryb
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg == '--best':
            show_best_trainings(registry)
        elif arg == '--compare':
            compare_parameters(registry)
        else:
            print(f"✗ Nieznany argument: {arg}")
            show_usage()
    else:
        # Domyślnie pokaż wszystkie
        show_all_trainings(registry)
        print(f"\n💡 Wskazówka: Użyj --best lub --compare dla innych widoków")

if __name__ == "__main__":
    main()
