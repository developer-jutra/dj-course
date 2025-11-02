# Zadanie 6

Uruchom lokalnie minimum 1 z poniższych:
- ollama (patrz: folder `local-ollama`)
- llama.cpp (patrz: folder `local-llama.cpp`)
- DMR (Docker Model Runner)
Wraz z wybranym obrazem (najlepiej FT: _Instruct_).

Zlokalizuj ścieżkę (lokalnie, na dysku) gdzie model jest przechowywany.
(zerknij na plik [`LINKS-and-STUFF.md`](./LINKS-and-STUFF.md) obok dla porównania)

# Zadanie 7

Uruchom wybrany model w google colab.
Skorzystaj z tego linku (jako punkt odniesienia): https://colab.research.google.com/drive/1l8nSfDHWQXV3Db6B4HoDq_rpsy1KYWlq

Ustaw środowisko uruchomieniowe (CPU/GPU):

![Google Colab Runtime Environment](./colab-file-runtime-env.png)

# Zadanie 8

Ustaw System Prompta (np. “_You are an evil prank-addict. You’re never serious_”)
W wybrany przez siebie sposób:
- Ollama - modelfiles (patrz: `local-ollama`)
- Llama.cpp (UI, http://127.0.0.1:8080) -> settings -> general -> System Message (patrz: `local-llama.cpp`)
- Lokalny model (na bazie kodu z repo: qwen, llama, gemma, etc.; patrz: `local-models`)
- Zewn. model (na bazie kodu z repo: openAI, anthropic, gemini; patrz: `external-model-*`)

I przetestuj poprawne działanie.

# Zadanie 9

Zwizualizuj Struktury wybranych LLMów:
- Jupyter i/lub Google Colab.
- Python + Pandas + Data visualization.

Do wyboru (wedle uznania):
- lokalne jupyter notebooks: `M1/jupyter/model-cards.ipynb`
- google colab: https://colab.research.google.com/drive/1jIAl7_QyJy1raIf9FpzYoLGFGknTwuQt
  - konieczny może być upload plików (do sesji google colab) z naszego repo z folderu `M1/jupyter/hf-configs` (np. `M1/jupyter/hf-configs/Bielik-7B-Instruct-v0.1-config.json`) z uwagi na to że google colab we free tier "resetuje sesję" wraz z plikami.

![google colab file upload](./colab-file-upload.png)

![google colab file upload success](./colab-file-upload-success.png)

# Zadanie 10

- lokalnie folder: `neural-networks`:
  - `neural-networks/xor-network.py`
  - `neural-networks/binary-classification-network.py`
  - `neural-networks/circle-in-square-network.py` - 🔥 TU JEST ZADANIE 🔥
- google colab: wersja https://colab.research.google.com/drive/13Uuyl8yT2az4UFa98vvCF9MjTRcCzmYm

"Do-trenuj" sieć, rozwiązującą problem klasyfikacji binarnej.
  - **OPIS SIECI**: Sieć ma na celu rozwiązanie problemu ***klasyfikacji binarnej***, polegającego na określeniu, czy dany dwuwymiarowy punkt $(x, y)$ leży wewnątrz okręgu o promieniu $0.5$ (etykieta 1) czy poza nim (etykieta 0), gdy punkt znajduje się w kwadracie $[-1, 1] \times [-1, 1]$.

Kod jest praktycznie gotowy, ale sieć ma niewłaściwie ustawioną strukturę (sieci - warstwy/neurony) i/lub parametry treningu.

🔥 **Twoje zadanie** 🔥: przestrukturyzować sieć i/lub przeparametryzować trening.

🔥 **Cel** 🔥: accuracy 100% przy małym rozmiarze (sieci i treningu).

Pomoce:
- **TensorBoard**:
  - otwierasz virtualenv (lub cokolwiek czego używasz do zależności)
  - `tensorboard --logdir=runs` i otwierasz: http://localhost:6006/
  - analityka treningowa będzie widoczna po uruchomieniu treningu
  - wszystkie 3 pliki/sieci zapisują się w folderze `runs` (nie musisz nic dodatkowo robić)
- **TensorFlow Visualizer**: https://playground.tensorflow.org

# Zadanie 11

Zaprojektuj rozwiązanie dla poniższego flow:
- Użytkownik zadaje pytanie (prompt)
- Model prosi o doprecyzowanie (“odwrócenie kontroli”)
- Użytkownik odpowiada (doprecyzowuje)
- Model może już odpowiedzieć

# Zadanie 12

AZØR the CHATDOG. Python.
Folder: `M1/azor-chatdog`

Istniejące API klienckie:
- `llama-cpp-python`: `M1/azor-chatdog/src/llm/llama_client.py`
- `google-genai` (gemini): `M1/azor-chatdog/src/llm/gemini_client.py`
ZADANIE - Dodaj nowego klienta/API (wybierz 1):
- Anthropic/zdalnie
- OpenAI/zdalnie (https://api.openai.com)
- OpenAI/REST-lokalnie/ollama
- huggingface/transformers
etc.

# Zadanie 13

AZØR the CHATDOG. Python.
Folder: `M1/azor-chatdog`

Zadanie - umożliwić ustawianie:
- Top P
- Top K
- Temperature
Dla wszystkich działających lokalnie klientów.

docs:
- google-genai: https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/content-generation-parameters#example
- llama-cpp-python: https://llama-cpp-python.readthedocs.io/en/latest/api-reference/
- openai: https://platform.openai.com/docs/api-reference/assistants/object#assistants/object-temperature
etc.
