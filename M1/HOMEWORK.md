# Zadanie 1

Skonfiguruj sobie dostęp: Anthropic / Gemini / OpenAI.
Dostępne API: python / node.js, w sumie 6 różnych kombinacji:
- `external-model-anthropic-node`
- `external-model-anthropic-py`
- `external-model-google-genai-node`
- `external-model-google-genai-py`
- `external-model-openai-node`
- `external-model-openai-py`

Foldery zawierają README z linkami do zakładania kont i kluczy API.
Można zasilić model jednorazowo np. kwotą 5$ i ustawić zmienne typu "maxTokens" na skrtajnie niską wartość typu 128 - wówsczas pojedynczy request kosztuje ~0.002$.
Google Gemini daje "hojne" darmowe quota na start.

W wybranym setupie stokenizuj odpowiedzi na wzór ![tokenized prompts and responses](./tokenized.png)

# Zadanie 2

Podepnij MLFlow - i podsłuchaj, co agent robi z (jakimś) modelem:
- Claude - najłatwiej (1 komenda CLI)
- Gemini - z poziomu kody python
- Lokalne modele - z poziomu kodu python

zobacz `mlflow/README.md`

# Zadanie 3

Robimy własny TOKENIZER.

Korpusy danych treningowych do wyboru:
- `korpus-nkjp`
- `korpus-wolnelektury`
- `korpus-spichlerz` (Bielik Team)
W repo znajdziesz instrukcje dla 3 różnych korpusów danych treningowych oraz bazowy kod pythonowy.

Zadania:
- stwórz własne tokenizery w oparciu o plik `tokenizer-build.py` (obecna wersja działa ale jest zahardkodowana). Zdynamizuj kod w taki sposób, aby móc dynamicznie tworzyć tokenizery w oparciu o zadane korpusy tekstowe. Stwórz
  - `tokenizer-pan-tadeusz.json` - tylko w oparciu o Pana Tadeusza ("wolnelektury")
  - `tokenizer-wolnelektury.json` - w oparciu o cały korpus "wolnelektury"
  - `tokenizer-nkjp.json` - w oparciu o cały korpus "nkjp"
  - `tokenizer-all-corpora.json` - w oparciu o wszystkie korpusy
- z HuggingFace wybierz LLM i ściągnij jego tokenizer (byle inny niż Mistral-v0.1 - bo to ten sam co Bielik v0.1) i dodaj go do swoich tokenizerów
- w nawiązaniu do sławnego badania ;) (https://arxiv.org/pdf/2503.01996) tokenizujemy różne teksty "na krzyż" różnymi tokenizerami
  - teksty:
    - "Pan Tadeusz, Księga 1" ("wolnelektury")
    - "The Pickwick Papers" (mini korpus / projekt gutenberg)
    - "Fryderyk Chopin" (mini korpus / wikipedia)
  - tokenizery - wszystkie dostępne (3 bielikowe + wybrany z HF + 4 stworzone)
  - zmontuj statystyki, które mają odpowiedzieć na pytanie: **DLA KAŻDEGO TEKSTU, KTÓRY TOKENIZER BYŁ NAJEFEKTYWNIEJSZY POD KĄTEM NAJMNIEJSZEJ ILOŚCI WYNIKOWYCH TOKENÓW?**
- sprawdź czy dla customowych tokenizerów zmiana rozmiaru słownika (default: `32k`) robi różnicę na wyniki?

# Zadanie 4

Jeśli skorzystasz z biblioteki `gensim`, może być konieczne zainstalowanie dodatkowych paczek lokalnie (W moim przypadku to było `brew install gcc pkg-config openblas` oraz `export PKG_CONFIG_PATH="/opt/homebrew/opt/openblas/lib/pkgconfig"`)

a w zasadzie to się wycofałem z instalowania tego gówna przez homebrew bo to się nie kończy - i lecę z `docker build -t scipy-env:latest .` i `docker run -it --rm -v "$(pwd)":/app scipy-env:latest /bin/bash`


# Zadanie 5

Zaimplementuj uproszczoną wersję **ATTENTION SCORE MATRIX (S)**
Kod wyjściowy: folder `szczypta-machine-learning`.
Posiłkuj się ulubionym coding agent + deep research + discordem 😉

Plik: `src/homework.ts`
