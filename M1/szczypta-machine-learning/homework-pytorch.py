"""
Zadanie 5: ATTENTION SCORE MATRIX (S) - Implementacja w PyTorch

Implementacja uproszczonej wersji mechanizmu Attention z Transformerów.

Wzór: S = Q × K^T
gdzie:
  Q = X × W_Q  (Query Matrix)
  K = X × W_K  (Key Matrix)

Intuicja:
- X: Macierz embeddingów wejściowych (tokeny)
- W_Q: Wagi transformacji dla Query ("co szukamy?")
- W_K: Wagi transformacji dla Key ("co oferujemy?")
- S: Attention scores - jak bardzo każdy token zwraca uwagę na każdy inny token

PyTorch: https://pytorch.org/
Docs: https://pytorch.org/docs/stable/index.html
Tutorial: https://pytorch.org/tutorials/beginner/basics/intro.html
"""

import torch
import json
import os
from pathlib import Path
from typing import Dict, List, Tuple


def load_test_case(case_name: str) -> Dict[str, List[List[float]]]:
    """
    Ładuje dane testowe z pliku JSON.
    
    Args:
        case_name: Nazwa przypadku testowego (np. 'case-1')
        
    Returns:
        Dict z kluczami: WK_Matrix, WQ_Matrix, X_Input_Matrix
    """
    testcases_dir = Path(__file__).parent / "testcases"
    case_file = testcases_dir / f"{case_name}.json"
    
    if not case_file.exists():
        raise FileNotFoundError(f"Nie znaleziono pliku: {case_file}")
    
    with open(case_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    return data


def calculate_attention_score_matrix(
    X: torch.Tensor,
    W_Q: torch.Tensor,
    W_K: torch.Tensor
) -> torch.Tensor:
    """
    Oblicza Attention Score Matrix (S) dla mechanizmu self-attention.
    
    Args:
        X: Input Matrix (embeddingi tokenów) - wymiary: [seq_len, d_model]
        W_Q: Query Weight Matrix - wymiary: [d_model, d_k]
        W_K: Key Weight Matrix - wymiary: [d_model, d_k]
        
    Returns:
        S: Attention Score Matrix - wymiary: [seq_len, seq_len]
        
    Wzór:
        Q = X @ W_Q    (Query Matrix)
        K = X @ W_K    (Key Matrix)
        S = Q @ K^T    (Attention Scores)
    """
    # Krok 1: Oblicz Query Matrix
    # Q = X × W_Q
    Q = torch.matmul(X, W_Q)
    
    # Krok 2: Oblicz Key Matrix
    # K = X × W_K
    K = torch.matmul(X, W_K)
    
    # Krok 3: Transpozycja Key Matrix
    # K^T
    K_T = K.transpose(-2, -1)  # transpose ostatnich dwóch wymiarów
    
    # Krok 4: Oblicz Attention Score Matrix
    # S = Q × K^T
    S = torch.matmul(Q, K_T)
    
    return S


def print_tensor_info(name: str, tensor: torch.Tensor, show_values: bool = True):
    """Wyświetla informacje o tensorze."""
    print(f"\n{name}:")
    print(f"  Wymiary: {list(tensor.shape)}")
    print(f"  Typ danych: {tensor.dtype}")
    print(f"  Urządzenie: {tensor.device}")
    if show_values:
        print(f"  Wartości:\n{tensor}")


def run_single_test_case(case_name: str = "case-1"):
    """
    Uruchamia test dla pojedynczego przypadku testowego.
    
    Args:
        case_name: Nazwa przypadku testowego (case-1, case-2, case-3, case-4)
    """
    print("\n" + "=" * 80)
    print(f"ZADANIE 5: ATTENTION SCORE MATRIX (S) - {case_name.upper()}")
    print("=" * 80)
    
    # Załaduj dane testowe
    data = load_test_case(case_name)
    
    # Konwersja do PyTorch Tensor
    X_input = torch.tensor(data['X_Input_Matrix'], dtype=torch.float32)
    W_Q = torch.tensor(data['WQ_Matrix'], dtype=torch.float32)
    W_K = torch.tensor(data['WK_Matrix'], dtype=torch.float32)
    
    print("\n📊 DANE WEJŚCIOWE:")
    print("-" * 80)
    print_tensor_info("X (Input Matrix)", X_input)
    print_tensor_info("W_Q (Query Weights)", W_Q)
    print_tensor_info("W_K (Key Weights)", W_K)
    
    print("\n" + "-" * 80)
    print("🔄 OBLICZENIA KROK PO KROKU:")
    print("-" * 80)
    
    # Krok 1: Query Matrix
    Q = torch.matmul(X_input, W_Q)
    print("\n🔹 KROK 1: Q = X × W_Q")
    print(f"  Wymiary: {list(X_input.shape)} × {list(W_Q.shape)} = {list(Q.shape)}")
    print(f"  Q =\n{Q}")
    
    # Krok 2: Key Matrix
    K = torch.matmul(X_input, W_K)
    print("\n🔹 KROK 2: K = X × W_K")
    print(f"  Wymiary: {list(X_input.shape)} × {list(W_K.shape)} = {list(K.shape)}")
    print(f"  K =\n{K}")
    
    # Krok 3: Transpozycja K
    K_T = K.transpose(-2, -1)
    print("\n🔹 KROK 3: K^T (Transpozycja)")
    print(f"  Wymiary: {list(K.shape)} → {list(K_T.shape)}")
    print(f"  K^T =\n{K_T}")
    
    # Krok 4: Attention Score Matrix
    S = torch.matmul(Q, K_T)
    print("\n🔹 KROK 4: S = Q × K^T")
    print(f"  Wymiary: {list(Q.shape)} × {list(K_T.shape)} = {list(S.shape)}")
    
    print("\n" + "=" * 80)
    print("🎯 WYNIK - ATTENTION SCORE MATRIX (S):")
    print("=" * 80)
    print(f"\n{S}")
    print(f"\nWymiary: {list(S.shape)}")
    
    # Interpretacja
    print("\n" + "-" * 80)
    print("💡 INTERPRETACJA:")
    print("-" * 80)
    print("Element S[i][j] reprezentuje 'attention score' - jak bardzo token i")
    print("powinien zwrócić uwagę na token j.")
    print()
    print("Wyższe wartości = silniejsza uwaga (attention)")
    print()
    print("W pełnym mechanizmie Attention (Self-Attention) następnie:")
    print("  1. Skalowanie: S_scaled = S / sqrt(d_k)")
    print("  2. Softmax: attention_weights = softmax(S_scaled)")
    print("  3. Value: V = X × W_V")
    print("  4. Output: attention_output = attention_weights × V")
    print("-" * 80)
    
    print("\n✅ TEST ZAKOŃCZONY")
    print("=" * 80 + "\n")
    
    return S


def run_all_test_cases():
    """Uruchamia testy dla wszystkich przypadków testowych."""
    cases = ['case-1', 'case-2', 'case-3', 'case-4']
    results = {}
    
    print("\n" + "=" * 80)
    print("🚀 ATTENTION SCORE MATRIX - WSZYSTKIE PRZYPADKI TESTOWE (PyTorch)")
    print("=" * 80)
    
    for case_name in cases:
        try:
            S = run_single_test_case(case_name)
            results[case_name] = S
        except FileNotFoundError as e:
            print(f"⚠️  Pominięto {case_name}: {e}")
        except Exception as e:
            print(f"❌ Błąd w {case_name}: {e}")
    
    # Podsumowanie
    print("\n" + "=" * 80)
    print("📊 PODSUMOWANIE WSZYSTKICH WYNIKÓW")
    print("=" * 80 + "\n")
    
    for case_name, S in results.items():
        print(f"{case_name.upper()} - Wymiary: {list(S.shape)}")
        print(f"{S}\n")
    
    print("=" * 80)
    print("✅ WSZYSTKIE TESTY ZAKOŃCZONE")
    print("=" * 80 + "\n")
    
    return results


def explain_pytorch_basics():
    """Wyjaśnia podstawy PyTorch użyte w implementacji."""
    print("\n" + "=" * 80)
    print("📚 PYTORCH - PODSTAWY")
    print("=" * 80 + "\n")
    
    print("PyTorch to biblioteka do głębokiego uczenia, która oferuje:")
    print("  • Tensory - wielowymiarowe tablice (jak NumPy, ale z GPU support)")
    print("  • Automatyczne różniczkowanie (autograd)")
    print("  • Modułowe budowanie sieci neuronowych")
    print("  • Optymalizatory i funkcje straty")
    print()
    
    print("OPERACJE UŻYTE W TYM ZADANIU:")
    print("-" * 80)
    print()
    
    print("1. torch.tensor() - Tworzenie tensora z listy/array")
    print("   >>> X = torch.tensor([[1, 2], [3, 4]], dtype=torch.float32)")
    print("   >>> # Tworzy tensor 2×2 z wartościami zmiennoprzecinkowymi")
    print()
    
    print("2. torch.matmul() - Mnożenie macierzy")
    print("   >>> A = torch.tensor([[1, 2], [3, 4]])")
    print("   >>> B = torch.tensor([[5, 6], [7, 8]])")
    print("   >>> C = torch.matmul(A, B)  # lub A @ B")
    print("   >>> # C = [[19, 22], [43, 50]]")
    print()
    
    print("3. tensor.transpose(-2, -1) - Transpozycja macierzy")
    print("   >>> A = torch.tensor([[1, 2, 3], [4, 5, 6]])")
    print("   >>> A_T = A.transpose(-2, -1)  # lub A.T")
    print("   >>> # A: 2×3 → A_T: 3×2")
    print()
    
    print("4. tensor.shape - Wymiary tensora")
    print("   >>> X = torch.tensor([[1, 2], [3, 4], [5, 6]])")
    print("   >>> X.shape  # torch.Size([3, 2]) - 3 wiersze, 2 kolumny")
    print()
    
    print("5. tensor.dtype - Typ danych")
    print("   >>> X = torch.tensor([1, 2, 3], dtype=torch.float32)")
    print("   >>> X.dtype  # torch.float32")
    print()
    
    print("6. tensor.device - Urządzenie (CPU/GPU)")
    print("   >>> X = torch.tensor([1, 2, 3])")
    print("   >>> X.device  # device(type='cpu')")
    print("   >>> X_gpu = X.to('cuda')  # Przeniesienie na GPU (jeśli dostępne)")
    print()
    
    print("=" * 80)
    print("📖 WIĘCEJ INFORMACJI:")
    print("=" * 80)
    print("  • PyTorch Homepage: https://pytorch.org/")
    print("  • Dokumentacja: https://pytorch.org/docs/stable/index.html")
    print("  • Tutoriale: https://pytorch.org/tutorials/")
    print("  • Quickstart: https://pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html")
    print("  • Tensors Tutorial: https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html")
    print("=" * 80 + "\n")


def compare_with_numpy():
    """Porównuje implementację PyTorch z NumPy."""
    import numpy as np
    
    print("\n" + "=" * 80)
    print("⚖️  PYTORCH vs NUMPY - PORÓWNANIE")
    print("=" * 80 + "\n")
    
    # Dane testowe
    X_list = [[1.0, 2.0], [3.0, 4.0]]
    W_Q_list = [[0.5, 0.5], [0.5, 0.5]]
    W_K_list = [[1.0, 0.0], [0.0, 1.0]]
    
    print("Dane testowe:")
    print(f"X = {X_list}")
    print(f"W_Q = {W_Q_list}")
    print(f"W_K = {W_K_list}")
    print()
    
    # PyTorch
    print("-" * 80)
    print("PYTORCH:")
    print("-" * 80)
    X_torch = torch.tensor(X_list, dtype=torch.float32)
    W_Q_torch = torch.tensor(W_Q_list, dtype=torch.float32)
    W_K_torch = torch.tensor(W_K_list, dtype=torch.float32)
    
    Q_torch = torch.matmul(X_torch, W_Q_torch)
    K_torch = torch.matmul(X_torch, W_K_torch)
    S_torch = torch.matmul(Q_torch, K_torch.T)
    
    print(f"S (PyTorch) =\n{S_torch}")
    print()
    
    # NumPy
    print("-" * 80)
    print("NUMPY:")
    print("-" * 80)
    X_np = np.array(X_list, dtype=np.float32)
    W_Q_np = np.array(W_Q_list, dtype=np.float32)
    W_K_np = np.array(W_K_list, dtype=np.float32)
    
    Q_np = np.matmul(X_np, W_Q_np)
    K_np = np.matmul(X_np, W_K_np)
    S_np = np.matmul(Q_np, K_np.T)
    
    print(f"S (NumPy) =\n{S_np}")
    print()
    
    # Porównanie
    print("-" * 80)
    print("RÓŻNICE:")
    print("-" * 80)
    diff = np.abs(S_torch.numpy() - S_np)
    print(f"Maksymalna różnica: {diff.max()}")
    print(f"Średnia różnica: {diff.mean()}")
    
    if diff.max() < 1e-6:
        print("✅ Wyniki są identyczne (różnice numeryczne < 1e-6)")
    else:
        print("⚠️  Wyniki się różnią!")
    
    print()
    print("-" * 80)
    print("GŁÓWNE RÓŻNICE PYTORCH vs NUMPY:")
    print("-" * 80)
    print("  PyTorch                           NumPy")
    print("  --------------------------------  --------------------------------")
    print("  torch.tensor()                    np.array()")
    print("  torch.matmul() lub @              np.matmul() lub @")
    print("  tensor.T lub .transpose()         array.T lub .transpose()")
    print("  tensor.shape                      array.shape")
    print("  tensor.dtype                      array.dtype")
    print("  tensor.to('cuda')                 -  (brak natywnego GPU)")
    print("  Autograd (gradient tracking)      - (brak autodiff)")
    print("  Integracja z nn.Module            - (brak modułów NN)")
    print()
    print("=" * 80 + "\n")


def main():
    """Główna funkcja programu."""
    print("\n" + "🔥" * 40)
    print("ZADANIE 5: ATTENTION SCORE MATRIX - PYTORCH")
    print("🔥" * 40 + "\n")
    
    # 1. Wyjaśnienie PyTorch
    explain_pytorch_basics()
    
    # 2. Porównanie z NumPy
    compare_with_numpy()
    
    # 3. Test pojedynczego przypadku
    print("\n" + "=" * 80)
    print("🧪 TEST POJEDYNCZEGO PRZYPADKU")
    print("=" * 80)
    run_single_test_case("case-1")
    
    # 4. Wszystkie przypadki testowe
    print("\n" + "=" * 80)
    print("🧪 WSZYSTKIE PRZYPADKI TESTOWE")
    print("=" * 80)
    run_all_test_cases()
    
    print("\n" + "🎉" * 40)
    print("ZADANIE ZAKOŃCZONE!")
    print("🎉" * 40 + "\n")


if __name__ == "__main__":
    # Sprawdź czy PyTorch jest zainstalowany
    print("Sprawdzanie instalacji PyTorch...")
    print(f"PyTorch version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"CUDA version: {torch.version.cuda}")
        print(f"GPU: {torch.cuda.get_device_name(0)}")
    print()
    
    # Uruchom główny program
    main()
