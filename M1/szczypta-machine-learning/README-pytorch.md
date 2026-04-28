# Zadanie 5 - PyTorch Implementation

## 🔥 Implementacja Attention Score Matrix w PyTorch

### Instalacja PyTorch

#### Opcja 1: Automatyczna (zalecana)
```bash
# Windows + CUDA 12.6
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu126

# Windows + CPU only
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Linux / macOS
pip3 install torch torchvision
```

#### Opcja 2: Z pliku requirements
```bash
pip install -r requirements-pytorch.txt
```

**Sprawdź instalację:**
```bash
python -c "import torch; print(f'PyTorch {torch.__version__}')"
```

### Uruchomienie

```bash
cd M1/szczypta-machine-learning
python homework-pytorch.py
```

### Co robi skrypt?

1. **Wyjaśnia podstawy PyTorch** - tensory, operacje, GPU
2. **Porównuje z NumPy** - pokazuje różnice i podobieństwa
3. **Testuje case-1** - pojedynczy przypadek testowy z szczegółami
4. **Testuje wszystkie case'y** - case-1 do case-4 automatycznie

### Funkcje dostępne

```python
from homework_pytorch import (
    calculate_attention_score_matrix,  # Główna funkcja obliczająca S
    run_single_test_case,              # Test pojedynczego case'u
    run_all_test_cases,                # Test wszystkich case'ów
    explain_pytorch_basics,            # Wyjaśnienie PyTorch
    compare_with_numpy                 # Porównanie PyTorch vs NumPy
)

# Przykład użycia
import torch

X = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
W_Q = torch.tensor([[0.5, 0.5], [0.5, 0.5]])
W_K = torch.tensor([[1.0, 0.0], [0.0, 1.0]])

S = calculate_attention_score_matrix(X, W_Q, W_K)
print(S)
```

### Struktura plików

```
M1/szczypta-machine-learning/
├── homework-pytorch.py           # ← NOWY PLIK (implementacja PyTorch)
├── requirements-pytorch.txt      # ← NOWY PLIK (zależności)
├── README-pytorch.md             # ← NOWY PLIK (ta dokumentacja)
├── testcases/
│   ├── case-1.json
│   ├── case-2.json
│   ├── case-3.json
│   └── case-4.json
└── src/
    ├── homework.ts               # Oryginalna implementacja TypeScript
    └── ...
```

### Wzór zaimplementowany

```
S = Q × K^T

gdzie:
  Q = X × W_Q    (Query Matrix)
  K = X × W_K    (Key Matrix)
```

### Operacje PyTorch

| Operacja | PyTorch | Opis |
|----------|---------|------|
| Tworzenie tensora | `torch.tensor(data)` | Konwersja z listy/array |
| Mnożenie macierzy | `torch.matmul(A, B)` lub `A @ B` | Dot product |
| Transpozycja | `tensor.T` lub `.transpose(-2, -1)` | Zamiana wierszy z kolumnami |
| Wymiary | `tensor.shape` | Rozmiar tensora |
| Typ danych | `tensor.dtype` | float32, int64, etc. |
| Urządzenie | `tensor.device` | CPU lub CUDA (GPU) |

### PyTorch vs NumPy

| Cecha | PyTorch | NumPy |
|-------|---------|-------|
| GPU Support | ✅ `tensor.to('cuda')` | ❌ |
| Autograd | ✅ Automatyczne gradienty | ❌ |
| Neural Networks | ✅ `torch.nn` | ❌ |
| Składnia | Bardzo podobna | Bardzo podobna |
| Szybkość (CPU) | Podobna | Podobna |
| Szybkość (GPU) | 🚀 10-100x szybciej | N/A |

### Przykładowy output

```
KROK 1: Q = X × W_Q
  Wymiary: [2, 2] × [2, 2] = [2, 2]
  Q =
tensor([[3., 3.],
        [7., 7.]])

KROK 2: K = X × W_K
  Wymiary: [2, 2] × [2, 2] = [2, 2]
  K =
tensor([[1., 2.],
        [3., 4.]])

KROK 3: K^T (Transpozycja)
  Wymiary: [2, 2] → [2, 2]
  K^T =
tensor([[1., 3.],
        [2., 4.]])

KROK 4: S = Q × K^T
  Wymiary: [2, 2] × [2, 2] = [2, 2]

🎯 ATTENTION SCORE MATRIX (S):
tensor([[ 9., 18.],
        [21., 42.]])
```

### Dodatkowe informacje

- **PyTorch Homepage**: https://pytorch.org/
- **Dokumentacja**: https://pytorch.org/docs/stable/index.html
- **Tutoriale**: https://pytorch.org/tutorials/
- **Quickstart**: https://pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html
- **Tensors**: https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html

### GPU Support (opcjonalnie)

Jeśli masz GPU NVIDIA z CUDA:

```python
# Sprawdź dostępność CUDA
import torch
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"GPU: {torch.cuda.get_device_name(0)}")

# Przenieś obliczenia na GPU
X = torch.tensor([[1.0, 2.0]]).to('cuda')
W_Q = torch.tensor([[0.5], [0.5]]).to('cuda')
S = calculate_attention_score_matrix(X, W_Q, W_K)
```

### Troubleshooting

**Problem**: `ModuleNotFoundError: No module named 'torch'`
```bash
pip install torch torchvision
```

**Problem**: CUDA not available (mimo posiadania GPU)
```bash
# Reinstaluj z CUDA support
pip uninstall torch
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126
```

**Problem**: Brak pliku `case-X.json`
```bash
# Upewnij się że jesteś w odpowiednim katalogu
cd M1/szczypta-machine-learning
ls testcases/  # powinno pokazać case-1.json, case-2.json, etc.
```

### Zadanie wykonane ✅

- ✅ Implementacja w PyTorch
- ✅ Wszystkie 4 przypadki testowe
- ✅ Szczegółowe wyjaśnienia
- ✅ Porównanie z NumPy
- ✅ Dokumentacja PyTorch basics
- ✅ Interpretacja wyników
