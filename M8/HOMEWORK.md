# Zadanie 1

Analiza / Optymalizacja wydajności bazodanowej PostgreSQL.

Wskakuj do `M8/wms` - masz tu rozbudowany setup docker compose z pythonem + postgresem:
- różnych skryptów jest sporo, ale patrz na `Taskfile.yml` (uruchamiane: `task` po HELP lub `task <COMMAND>`).
- albo wszystko uruchamiasz w dockerze (łącznie z API: `task run-wms`) albo wszystko w dockerze a API bezpośrednio lokalnie, poza dockerem (`run-wms-with-local-api`) - kwestia wygody/preferencji.
- API `M8/wms/wms-api` strzela do postgresa - różnych query jest +-30, więc jest w czym wybierać
- w pliku `.http` masz wylistowane wygodnie wszystkie endpointy HTTP (na które możesz strzelać, w razie czego zainstaluj [VSCode ext httpYac](https://marketplace.cursorapi.com/items/?itemName=anweber.vscode-httpyac) i przeklikuj requesty), to taki "quasi-kontrakt"

Zadanie:
- analizujesz dane query poprzez `EXPLAIN ANALYZE ...` i - jeśli jest co - to optymalizujesz
- jeśli chcesz to ręcznie, a jeśli chcesz to koordynuj współpracę z agentem.
- weź na tapet minimum 5 query. W niektórych trzeba coś poprawić, a w innych nie (query zostawiasz w spokoju - chodzi o indeksy)
- możesz wygenerować sobie mały dataset (`task generate-sql-and-sync`) albo duży (`task generate-sql-and-sync MODE=LARGE`). Polecam duży :)

Pytanie: ile roboty planujesz oddać agentowi? Jeśli zrobi za Ciebie wszystko (odpyta bazę, sprawdzi strukturę, indeksy, wdroży zmiany - a Ciebie tylko spyta o pozwolenie) to:
- ile, jak myślisz, się nauczysz przy okazji?
- jak planujesz weryfikować czy faktycznie zrobił co to trzeba?

Rezultat:
- podziel się na discordzie przykładowymi usprawnieniami + wyjaśnieniem

# Zadanie 2

Katalog Floty (TMS)
Przeprowadź sesję modelowania bazy z LLM
Moduł: Katalog Floty (pojazdów)

Rezultat: ER/mermaid + zsynchronizowany SQL

Szczegóły: plik `./HOMEWORK-tms-modelling.md`

# Zadanie 3

Zaimplementuj JEDEN wybrany moduł Customer Portal, w oparciu o LLM:
- Storage
- Shipments
- Tracking

Plik `./HOMEWORK-cp-requirements.md` zawiera dość szczegółowe wymagania funkcjonalne. Zaimplementowanie wszystkiego (w ramach 1 modułu!) mile widziane - w celu ćwiczenia efektywnej pracy (radzenia sobie) z LLMem w stosie potencjalnie nieznanym.

**Wariant absolutnego minimum**:
- usunięte mocki i zastąpione komunikacją z mongo (poprzez serwerową implementację nuxt)
- działają podstawowe operacje (zapis, odczyt)
- udana weryfikacja zmian w kolekcjach mongo (np. poprzez mongosh lub Mongo compass)

# Zadanie 4

Podepnij MCP zarówno dla Postgres jak i MongoDB (wykorzystaj Customer Portal, WMS, TMS - jak wolisz), a następnie wykonaj poniższe zadania:
- tabele/kolekcje
  - dodaj kilka kolekcji/tabel do skryptu inicjującego kontener (np. `M8/customer-portal/mongodb/cp/init-db.js` czy `M8/pgsql-playground/postgres/init-scripts/init-db.sql`)
  - każ modelowi sprawdzić, czy zawartość z pliku i w faktycznej bazie jest ta sama.
  - każ modelowi wygenerować "skrypt migracji" (kod SQL lub mongosh który wykonuje "ALTER TABLE", dostosowując tabele/kolekcje do oczekiwanego stanu)
- indeksy
  - zleć wylistowanie wszystkich indeksów
  - (w osobnym wątku) poproś model o wygenerowanie 3 przykładowych zaawansownaych zapytań - i odpytaj, czy są pokryte przez którykolwiek indeks w bazie
  - zleć modelowi stworzenie planu, gdzie krok po kroku opracowuje odpowiedni indeks i - wedle preferencji - dodaje go do bazy lub zapisuje w pliku
- statystyki i interpretacja danych
  - zleć modelowi stworzenie zestawienia dotyczącego liczebności wpisów (rekordów/dokumentów) we wszystkich tabelach/kolekcjach baz
  - każ modelowi zinterpretować dane które są w bazie - np. czego dotyczą zlecone zamówienia (w CP) czy jakie są dostępne pojazdy w TMS. Model ma wiedzieć, o co ma odpytać - a na podstawie tego zinterpetować zawartość bazy.,

Na koniec, podziel się wrażeniami: łatwiej samodzielnie czy poprzez MCP?

# Zadanie 5

Zamodeluj bazę przy użyciu JSONB. Uwzględnij tabele, kolumny, indeksy - oraz query.

Całe zadanie jest rozpisane w folderze `M8/HOMEWORK-wms-storage` (zawiera plik readme + plik `.http`).

# Zadanie 6

MongoDB Research.

Przeprowadź sesję Deep Research z LLM
dotyczący zaawansowanej problematyki bazodanowej. Podczas sesji, de facto, zestawisz działanie PostgreSQL z MongoDB.

Pytania spisane w pliku: `./HOMEWORK-mongo-research.md`

WAŻNE:
- Przede wszystkim ZROZUM PYTANIE
- NIE chodzi o odpowiedź, chodzi o przetworzenie odpowiedzi LLMa - czy się je rozumie.

**Cel**: ćwiczymy umiejętność samodzielnej nauki trudnych konceptów. W razie potrzeby - pytamy śmiało na discordzie!

**PODSUMOWANIE**: Gdybyś zechciał(a) porównać wysokopoziomowo postgresa i mongo (coś na zasadzie: "który lepszy?") to na jakie elementy w prompcie trzeba uwazać szczególnie?
