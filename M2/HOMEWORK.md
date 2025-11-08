# Zadanie 1

Jailbreaking.
Sprowokuj wybranego LLMa (może lepiej lokalnego, aby "nie naruszać zasad" dostawców zewn.) do wykonania akcji niedozwolonej.

Szczegóły omówione w lekcji "praca domowa".

Przykłady/inspiracje: `M2/jailbreaking`.

**CEL**: osiągnięcie min. 1 skutecznego jailbreaka.

# Zadanie 2

Syntezacja mowy: **TEXT-TO-SPEECH**

Bezpośrednio poniżej techniczny opis - zaś sam opis ZADAŃ jest w punktach 2.1 i 2.2 niżej.

przygotowane/używane syntezatory:
- suno:
  - `text-to-speach-suno-bark`, `python run.py`
  - słabsze jakościowo (output zaszumiony)
- xtts
  - `text-to-speach-xtts`, `python run.py`
  - lepsze jakościowo
  - obsługuje de facto wiele modeli pod spodem (komenda: `tts --list_models`, oczywiście mając zainstalowane zależności, np. w venvie)
  - wymaga pythona max 3.12 (z 3.13+ nie pójdzie)
    - polecane `pyenv`, działające bardzo podobnie do `nvm`/node.js
    - nie znasz `pyenv`? Super - poproś LLMa o wygenerowanie tutoriala dla Ciebie, np.
    > wygeneruj podstawowy tutorial uczący jak wykorzystywać pyenv. Mam zainstalowanego globalnie pythona 3.13 - i chcę dodatkowo mieć pythona 3.12 ale nie globalnie. I dla tego pythona stworzyć virtualenv (`.venv`) w którym będą moje zależności. Wygeneruj wszystkie potrzebne komendy, każda z krótkim opisem co robi i dlaczego jest potrzebna.
    ale dostosuj go do siebie, np. doprecyzuj system operacyjny (i cokolwiek, czego jeszcze potrzebujesz)

uruchom syntezator suno/bark:
- albo lokalnie
- albo z google colab: https://colab.research.google.com/drive/1hIsAmSCaiR_mo_BggjHRGNoi9z4WO0P6?usp=sharing

uruchom xtts:
- albo lokalnie
- albo z google colab. I jeśli chcesz - spróbuj samodzielnie przygotować colaba. Jeśli się zdecydujesz, to - ważne:
  - ustaw ŚRODOWISKO (żeby bazował nie na CPU-only tylko np. `GPU T4` lub `v5e-1 TPU` - ustawienia / **Zmień typ środowiska wykonawczego**). Chodzi, tylko albo aż, o czas.
  - upewnij się co do wersji pythona w collabie. W momencie tworzenia materiału jest to wersja 3.12.12, ale hipotetycznie domyślna wersja może się zmienić. Wówczas - sprawdź wersję:
  ```
  !python --version
  ```
  wykrzyknik jest kluczowy i oznacza uruchomienie kodu nie pythonowego - tylko w powłoce serwera collaba (tak samo ma jupyter).
  I w razie potrzeby - instalujesz oczekiwaną wersję:
  ```
  !apt-get install python3.12
  !python3.12 --version
  ```
  i tyle :)

docs:
- suno: https://github.com/suno-ai/bark
- xtts: https://github.com/coqui-ai/TTS

**Bazowy kod jest gotowy do uruchomienia**.

## Zadanie 2.1

Uruchom wybrany model **text-to-speech**. Rekomendowane: xtts (suno/bark daje mocno zaszumiony output). Jeśli wybierzesz xtts - daj swoją próbkę głosu, aby wygenerować syntetycznie Twoją mowę.

**CEL**: uruchomiłeś/aś syntezator lokalnie

## Zadanie 2.2

Do AZØRA (asystenta czatowego) dodaj nową komendę, np. `/audio` która wygeneruje dźwięk ostatniej odpowiedzi AZØRA jako plik dźwiękowy.

**CEL**: AZØR może do Ciebie mówić (szczekać?) dzięki nowej komendzie.

## Zadanie 2.3 (dla chętnych)

Wykorzystaj tekst zarówno Twojego prompta jak i odpowiedzi modelu (AZØRA) aby wygenerować spójny dialog - w oparciu o historię konwersacji, którą regularnie prowadzisz z asystentem czatowym.

Wykorzystujesz pod spodem ten sam syntezator (xtts), ale przekazujesz mu **inne sample** (aby dało się odróżnić rozmówców).

Do łączenia wielu plików .wav w 1 - wykorzystaj **dowolną** bibliotekę (np. `audiolab`, `scipy`, `wave`), posiłkuj się LLMami w celu pomocy z kodem. Rekomendacja - DIVIDE AND CONQUER (problem rozbij na mniejsze):
- w pierwszym kroku wygeneruj działający mini-skrypt który poprawnie obsłuży API i połączy 2 pliki wav w 1. (tu posiłkuj się deep researchem - no chyba że Twój agent kodujący ma zapewniony dostęp do internetu np. na poziomie "server tool calls")
- dopiero potem - w oparciu o działające API, zleć agentowi kodującemu integrację kodu z AZØREM)

**CEL**:
- prowadzisz konwersację
- uruchamiasz nową komendę np. `/audio-all`
- generuje się cała dotychczasowa konwersacja jako .wav

# Zadanie 3

Transkrypcja mowy: **SPEECH-TO-TEXT**

Wykorzystujemy model: `openai/whisper-tiny` (ok. 150MB miejsca, lekki) ale możesz podmienić (zachęcam do eksperymentów) na jakiś model większy (lista tu: https://huggingface.co/collections/openai/whisper-release)

Bazowy kod zarówno w `M2/transcriber` jak i `M2/transcriber-ui` - działa.

# Zadanie 3.1

Uruchamiasz lokalnie kod `M2/transcriber`. Wykorzystując przygotowane wcześniej sample z folderu `M2/sample-audio` otrzymujesz transkrypcję tekstową.

# Zadanie 3.2

Wykorzystujesz `M2/transcriber-UI`, które jest zbudowane w tkinter - pythonowym desktopowym GUI (pamięta ktoś Java Swing?).

Aplikacja działa.

**ZADANIE**: dodać 2 zakładki (na wzór superwhisper/czegokolwiek):
- jedna przedstawia historię transkrypcji, czyli pojedynczych "uruchomień" transkrypcji wraz z tekstem wynikowym (w dowolnej formie)
- możliwość usuwania pojedynczej transkrypcji
- wymaganie - program przechowuje swoje dane "gdzieś" w formie i plików .wav i .json. Zarządzanie transkrypcjami ma być odzwierciedlane w plikach (tworzone/usuwane) - aby było spójnie

Zapewne nie znasz tkintera (byłoby dziwne gdybyś znał(a)) - i o to chodzi. Działaj z kodującym agentem.

**Rekomendacja**: dobrze przemyśl, co ma być zbudowane, jak UI ma się zachowywać. Po prostu wymyśl szczegóły UI-a - jak ma wyglądać. I dopiero pisz prompty.

# ALTERNATYWNIE 3.2

Jeśli nie chcesz (nie lubisz) tkintera (bo jest to technologia niszowa i mało kto ją zna), możesz zbudować swoją aplikację desktopową o zupełnie inny stos, np.
- wails:
  - backend: go, frontend: cokolwiek
  - https://wails.io/
- tauri:
  - backend: rust, frontend: cokolwiek
  - https://v2.tauri.app/

przy czym - do obsługi `openai/whisper-tiny` - i tak będziesz potrzebować pythonowego `transformers`. Wówczas go/rust uruchamia transformers jako skrypt z shella, który zwyczajnie kończy się (1) utworzeniem pliku i (2) zwraca kod wynikowy z powłoki (każda komenda konsoowa zwraca kod; jeśli kod=0 - jest ok, nie-0 - jakiś błąd).

Natomiast complexity związane z uruchamianiem serwera go/rust który dopiero uruchamia pythona - znika, jeśli wykorzystasz tkintera.

# Zadanie 4

`Toon` (Token-Oriented Object Notation)
https://github.com/toon-format/toon

Tokenizujemy pliki - analogicznie jak w poprzednim module, ale tym razem: `JSON`, `YAML` i `TOON`:
- do dyspozycji mamy różne tokenizery `M2/toon/tokenizers/*.json`
- do dyspozycji mamy sample files w `M2/toon/samples`, gdzie każdy sample jest 4 formatach: `.json`, `-nows.json` (no whitespace), `.yaml`, `.noon`

Inicjalny skrypt `M2/toon/tokenize-json-toon.py` tokenizuje 1 tokenizerem 1 pełny sample (4 pliki o różnych formatach).

Jeśli dodasz dowolny poprawny JSON, to uruchom `gen-from-json.py` (dodając tam nazwę tego JSONa) i wygeneruje Ci pozostałe 3 formaty (z `.json` - wygeneruje: `-nows.json`, `.yaml`, `.noon`). `noon` jest uruchamiane poprzez `npx` (wymagany node.js), bo w momencie publikacji paczka https://github.com/toon-format/toon-python jest WIP.

## Zadanie 4.1

**ZADANIE**:
- każdy sample to de facto 4 pliki (inne formaty ale mają tę samą treść)
- uruchom tokenizację dla wszystkich sampli (i ich 4 formatów)
- to samo uruchom dla udostępnionych tokenizerów
- stwórz wizualne zestawienie wyników
- możesz wskazać, o ile toon wychodzi oszczędniej w tokenach
- dla chętnych:
  - bierzesz pythonowe [openAI/tiktoken](https://github.com/openai/tiktoken) i dokonujesz praktycznie to samo (tokenizacja) ale siłą rzeczy ta libka ma inne API.

**OPCJE**:
- konsolowo: `tokenize-json-toon.py`
- przy użyciu `marimo` (nowocześniejsza i znacznie lepsza wersja `jupyter`)
  - uruchamiasz `marimo edit` (w venv, w folderze zadania)
  - otwiera się automatycznie okno w przeglądarce
  - przeklikujesz do pliku `tokenize-marimo.py` i masz marimo-notebook
  - (note: nie bój się marimo, to po prostu odświeżony jupyter: https://github.com/marimo-team/marimo)

Pliki mają logicznie tę samą treść.

## Zadanie 4.2

Spróbuj przedstawić dane w formie quasi-konsolowego-wykresu tak jak poniżej (chodzi tylko o formę prezentacji):

```
arch
→ JSON compact   ████████████████████    100.0% (2858)
  TOON           ██████████████████░░     99.1% (2883)
  YAML           ████████████████░░░░     94.7% (3019)
  JSON           █████████░░░░░░░░░░░     54.2% (5270)

placeholder
→ TOON           ████████████████████    100.0% (110)
  JSON compact   ██████████████████░░     83.3% (132)
  YAML           █████████████████░░░     80.0% (114)
  JSON           ████████████░░░░░░░░     73.3% (150)

recipe
→ TOON           ████████████████████    100.0% (1182)
  YAML           ██████████████████░░     89.1% (1326)
  JSON compact   ██████████████░░░░░░     72.6% (1629)
  JSON           ████████████░░░░░░░░     48.8% (2420)

models
→ TOON           ████████████████████    100.0% (349)
  YAML           █████████████████░░░     72.6% (481)
  JSON compact   ██████████████░░░░░░     52.0% (671)
  JSON           ████████████░░░░░░░░     33.8% (1033)
```

albo:

```
arch
→ JSON compact   ####################    100.0% (2858)
  TOON           ##################..     99.1% (2883)
  YAML           ################....     94.7% (3019)
  JSON           #########...........     54.2% (5270)

placeholder
→ TOON           ####################    100.0% (110)
  JSON compact   ##################..     83.3% (132)
  YAML           ################....     80.0% (114)
  JSON           ############........     73.3% (150)

recipe
→ TOON           ####################    100.0% (1182)
  YAML           ##################..     89.1% (1326)
  JSON compact   ##############......     72.6% (1629)
  JSON           ############........     48.8% (2420)

models
→ TOON           ####################    100.0% (349)
  YAML           ################....     72.6% (481)
  JSON compact   ##############......     52.0% (671)
  JSON           ############........     33.8% (1033)
```

# Zadanie 5

Research codebase przy użyciu [code2tutorial](https://code2tutorial.com/).

Wykorzystaj jakieś własne repo (a jeśli takowego nie masz, to stwórz własne i zuploaduj do niego AZØRA) - i każ code2tutorial wygenerować raport, który opisuje zawartość/strukturę repo.

W założeniu powinno generować przejrzystą dokumentacę/raport. W praktyce - bywa różnie ;) raz lepiej, raz gorzej. Automat ¯\_(ツ)_/¯

## Zadanie 5.1

**ZADANIE**: po prostu odpal to narzędzie :) i przejrzyj output

# Zadanie 5.2

**Zaprojektuj** (NIE IMPLEMENTUJ bo to za dużo pracy) jak tej klasy narzędzie działa pod spodem. Co robi agent/orkiestrator? Jak wygląda komunikacja (przepływ, np. diagramy sekwencji)? Jak wygląda ruch sieciowy? Jak są montowane dane?

**CEL**: dowolne diagramy, opis tekstowy raczej (bardzo) króki.

**PO CO**? Umiejętność projektowania jest KLUCZOWA w rozwoju.

# Zadanie 6

AZØR - Nadaj tytuł wątkowi

Najpierw ZAPROJEKTUJ - potem ZAKODUJ ficzer który umożliwia AZØROWI tytułowanie wątków (konwersacji) podczas ich tworzenia.

W typowych aplikacjach konwersacyjnych działa to tak:
- otwierasz nowy wątek, piszesz prompta
- otrzymujesz odpowiedź (obviously)
- wątek jest domyślnie TYTUŁOWANY na podstawie Twojego pierwszego prompta
- możesz potem wątek "przenazwić", ale wyłącznie ręcznie. Automatyczne nazywanie wątku dzieje się tylko przy pierwszym prompcie.

**ZADANIE**:
- najpierw PRZEMYŚL jak to zrobić. Omawiaj na discordzie pomysły. Różnych rozwiązań jest sporo, są lepsze i gorsze, prostsze i trudniejsze
- ZAIMPLEMENTUJ. Obecnie wątki można identyfikować jedynie po ID sesji i - o ile w przypadku przełączania wątku to musi zostać - o tyle wyświetlenie tytułu wątku (wraz z jego wcześniejszym ustaleniem) byłoby bardzo user-friendly.
- Tytułowanie wątku dzieje się z automatu. Jeśli powstaje wątek (wysłałeś/aś prompta), to musi być zatytułowany
- nowa komenda daje możliwość "przenazwić" tytuł wątku
- Tytuł wątku jest (siłą rzeczy) przechowywany w plikach `.json`, dla spójności systemu

# Zadanie 7

AZØR - Wyspecjalizowani asystenci

Rozbuduj AZØRA (kod bazowy - z `M1/azor-chatdog`)
- kodujesz możliwość tworzenia różnych **wyspecjalizowanych asystentów**.
- użytkownik przełącza asystenta manualnie, np. nową komendą
- asystenci mogą być zahardkodowani w kodzie (choć można zaprogramować tworzenie nowych dynamicznie np. nową komendą)
- Wątek powinien mieć określonego aktualnego asystenta (aby było spójnie i jednoznacznie)

**CEL**: masz minimum 2 nowych asystentów (a AZØR zostaje - więc w sumie minimum trzech). I w możesz w trakcie trwania konwersacji ich przełączać.

Inspiracje asystentów:
- perfekcjonista przykładający ogromną wagę do detali.
- biznesmen zorientowany na cele, wypowiadający się bardzo rzeczowo i krótko.
- optymistyczny pochlebca który zawsze pocieszy i dopytuje jak się czujesz.
ale to może być co-/ktokolwiek.

# Zadanie 8

TEXT-TO-SONG ;)

- Wskakuj na suno.com
- Korzystasz z darmowego planu
  - 50 kredytów oznacza de facto 5 żądań
  - jeśli masz jakieś "robocze" konta, to tym więcej będziesz mieć kredytów 🧅
- Przygotowujesz tekst utworu muzycznego (inspiracje znajdziesz w `M2/text-to-song`) ale śmiało zachęcam do twórczości - czy to z LLMami, czy własnej
- Generujesz 🎵 utwory 🎶
- Rezultaty wrzucasz na discorda na kafał `#ai-music-corner` :)

W suno:
- zakładka `CREATE`
- wklejasz **lyrics** (no chyba że chcesz instrumental - to wtedy napisz np. `[instrumental]`, `[no lyrics]`, w przeciwnym razie sam jakiś tekst naklepie)
- klejasz **style** - tu wstawiasz nie tylko gatunki muzyczne, ale wszelkie detale typu "bells", "screaming", "fast", "slow", "gentle", co kto lubi

**CEL**: MIEĆ Z TEGO RADOŚĆ I DOBRĄ ZABAWĘ 😎
