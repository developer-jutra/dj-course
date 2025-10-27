# Tokenizer

projekt:
- `tokenizers/*.json` - tu są tokenizery, niektóre oryginalne (bielik), a inne TY stworzysz :)
- `corpora.py` - util pozwalający dobrać się do plików korpusów danych treningowych
- `tokenizer-build.py` - tu tworzysz własny tokenizer
- `tokenize-pan-tadeusz.py` - przykład tokenizacji tekstu w oparciu o tokenizer
- `tokenize-visualize.py` - wizualizacja tokenizacji

Paczka pythonowa: [`tokenizers`](https://pypi.org/project/tokenizers/). Bierz LLMa w dłoń - i do dzieła!

----

## Terms of Use (Bielik ale nie tylko)

Prawdopodobnie będziesz potrzebować wyrazić zgodę na terms of use dla tego modelu (bezpłatne, ale wymagane, na hugging face, https://bielik.ai/terms/ - chodzi o takie rzeczy jak podleganie polskiemu prawu + niedochodzenie roszczeń do tworców Bielika itp).

MODELE:
- bielik v1: https://huggingface.co/speakleash/Bielik-7B-Instruct-v0.1
  - TOKENIZER: https://huggingface.co/speakleash/Bielik-7B-Instruct-v0.1/raw/main/tokenizer.json
- bielik v2: https://huggingface.co/speakleash/Bielik-11B-v2.5-Instruct
  - TOKENIZER: https://huggingface.co/speakleash/Bielik-11B-v2.5-Instruct/raw/main/tokenizer.json
- bielik v3: https://huggingface.co/speakleash/Bielik-4.5B-v3.0-Instruct
  - TOKENIZER: https://huggingface.co/speakleash/Bielik-4.5B-v3.0-Instruct/raw/main/tokenizer.json

-----

# NKJP info

Katalog zawiera ręcznie anotowany podkorpus milionowy, stworzony przez próbkowanie tekstów na bazie podzbioru Narodowego Korpusu Języka Polskiego. 
Dokładniejszy opis znajduje się w pliku NKJP_1M_header.xml, a wyczerpujący - w podręczniku "Narodowy Korpus Języka Polskiego" (Wydawnictwa Naukowe PWN, Warszawa 2012).

Podkorpus dostępny jest na licencji CC BY 3.0 PL (Uznanie autorstwa 3.0 Polska). Więcej informacji: https://creativecommons.org/licenses/by/3.0/pl/.
