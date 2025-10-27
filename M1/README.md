# M1: LLMy i Agenty: Architektura i Działanie

- **bazowy kod klientów** zewn. LLM (wymaga pdania klucza):
  - `external-model-anthropic-node`, `external-model-anthropic-py` - kod anthropickowy
  - `external-model-google-genai-node`, `external-model-google-genai-py` - kod google'owski
  - `external-model-openai-node`, `external-model-openai-py` - kod openAI'owy
- `jupyter` - lokalny setup pod jupyter notebook
  - sample google colab: https://colab.research.google.com/drive/1iOVHEodRAJiOUAaczd-71W7dbWTziHI3
- **korpusy** do wykorzystania w tokenizacji i trenowaniu modeli
  - `korpus-wolnelektury` - statyczne pliki `.txt` z literaturą piękną z serwisu WolneLektury.pl
  - `korpus-nkjp` - kod do (prze)tworzenia podkorpusu milionowego NKJP, 
- **local models**:
  - `local-ollama` - pliki `Modelfile`, służące w `ollama` do stworzenia nowej wersji/nakładki dla modelu LLM
  - `local-llama.cpp` - llama.cpp
- `mlflow` - nasłuchiwanie interackji agent-model przy użyciu mlflow, claude/llama
  - lokalny serwer `llama-cpp-python`
- `szczypta machine-learning` - ilustracja w formie kodu najważniejszych operacji tensorowych w ML (te same rzeczy robi pytorch/tensorflow, ale tu jest to pokazane "od zera")
