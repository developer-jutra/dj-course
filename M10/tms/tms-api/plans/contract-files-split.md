Do profesjonalnego zarządzania rozproszoną dokumentacją OpenAPI najlepiej nadaje się **Redocly CLI**. To branżowy standard, który pozwala na walidację, łączenie (bundling) i dzielenie plików bez pisania własnych skryptów.

Aby zrealizować Twój scenariusz, użyjemy funkcjonalności **Bundling**, która pozwala utrzymać wiele małych plików, a na potrzeby generatorów kodu lub dokumentacji wystawiać jeden scalony plik.

### Narzędzie: Redocly CLI

1. **Instalacja**:
Wymaga Node.js. Instalujesz globalnie:
```bash
npm install -g @redocly/cli

```


2. **Struktura plików**:
Zgodnie z Twoim opisem, Twoja struktura będzie wyglądać tak:
```text
project-root/
├── src/
│   ├── main-openapi.yaml        # Plik główny (entry point)
│   ├── drivers/
│   │   └── drivers-openapi.yaml
│   └── customers/
│       └── customers-openapi.yaml
└── redocly.yaml                 # Konfiguracja (opcjonalnie)

```


3. **Jak połączyć pliki (Komenda)**:
W głównym pliku `src/main-openapi.yaml` odwołujesz się do mniejszych plików za pomocą standardu `$ref`. Następnie uruchamiasz komendę `bundle`:
```bash
redocly bundle src/main-openapi.yaml --output dist/openapi.yaml

```


* `src/main-openapi.yaml` – ścieżka do pliku wejściowego.
* `--output dist/openapi.yaml` – gdzie ma zostać zapisany wynikowy, duży plik.



### Przykład zawartości plików

Aby to zadziałało, plik główny musi "wiedzieć" o istnieniu pozostałych. Poniżej znajdziesz gotowy szablon, jak te pliki powinny wyglądać.

### Dlaczego to rozwiązanie jest lepsze od skryptu?

1. **Linter**: Redocly od razu sprawdza, czy Twoje mniejsze pliki są poprawne (komenda `redocly lint`).
2. **Preview**: Możesz odpalić podgląd dokumentacji na żywo: `redocly preview-docs src/main-openapi.yaml`.
3. **Brak duplikacji**: Nie musisz kopiować sekcji `components` do każdego pliku – Redocly sam znajdzie powiązania i "wyciągnie" tylko to, co jest potrzebne do finalnego pliku.


Przykladowy plik main:

```
openapi: 3.1.0
info:
  title: Fleet Management API
  version: 1.0.0
paths:
  # Importowanie endpointów z konkretnych plików
  /drivers:
    $ref: './drivers/drivers-openapi.yaml#/paths/~1drivers'
  /drivers/{id}:
    $ref: './drivers/drivers-openapi.yaml#/paths/~1drivers~1{id}'
  /customers:
    $ref: './customers/customers-openapi.yaml#/paths/~1customers'
components:
  schemas:
    # Możesz tu trzymać wspólne modele lub też je wydzielić
    Error:
      type: object
      properties:
        code:
          type: string
```