# Zadanie 1

Uzupełnij setup deliveroo:
- Dodaj rejestr obrazów docker 🐳
- Napisz skrypt shell który:
  - Buduje obraz
  - Pushuje go do ww. rejestru
- Do rejestru dodaj jakiś UI
- Wrzuć screena z otagowanym obrazem

# Zadanie 2

Wraz z Deep Research wygeneruj docker-compose.yml:
- server mongo + mongo-express (admin UI) + redis
- server: node.js/TS/express albo golang/gin
- apka zawiera 2 endpointy:
  - GET /invoices
  - POST /invoices
    odpowiednio czytające/modyfikujące db + zapisujące/aktualizujące kesz redisowy
- uruchom i upewnij się, że działa poprawnie
- wypróbuj inne LLMy - i porównaj precyzję

# Zadanie 3

Reguły dla Dockerfile i Docker Compose
- weź transkrypcje z tego modułu
- zmontuj (wraz z LLMem) best practices dla Dockerfile i docker-compose.yml
- iteruj (np. z innym LLMem/agentem)
- zweryfikuj samodzielnie

# Zadanie 4

Zoptymalizuj obrazy apek frontendowych:
- `deliveroo/tms-frontend` (react)
Opcjonalnie:
- `deliveroo/customer-portal` (vue/nuxt)
- `deliveroo/wms-frontend` (angular)
Przeanalizuj obrazy z `dive` - przed i po optymalizacji.

Sprawdź, czy możesz zastosować mechanizm docker [**Cache Mount**](https://docs.docker.com/build/cache/optimize/#use-cache-mounts) aby zwiększyć optymalizację.

Kontenery mają być uruchomione nie spod roota.

# Zadanie 5

Zintegruj dockera z MCP:
- Ustaw wybrany serwer MCP dla dockera
- Wykorzystaj `wms-api` które rzuca błędem dla `GET /employees`
- Agent/LLM ma mieć dostęp do błędów z SQL (brakująca kolumna na tabeli `party`)
- Wybierz `wms-api` z `M6/devcontainers/wms-api` (bo `wms-api` mamy kilka!)

# Zadanie 6

Wykorzystaj setup Dev Containers z repo:
- Uruchom `wms-api` pod devcontainers
- Dodaj do setupu reverse proxy nginx tak,
aby na `/` szedł forward `wms-api`
- Wykorzystaj Deep Research
- Podziel się nie tylko rozwiązaniem, ale i **ewentualnym procesem nauki**

Zmodyfikuj docker-compose dla `wms-api` tak, aby oprzeć go o [compose/watch](https://docs.docker.com/compose/how-tos/file-watch/).

# Zadanie 7

Aplikacja pythonowa `wms-api` ma wyłącznie server developerski.
Dostosuj setup tak, aby dodać serwer produkcyjny WSGI:
- np. Gunicorn (green unicorn)

Rozbuduj docker-compose
(np. ten mniejszy z dev containers):
- dodaj profile `dev` i `prod`
- sprawdź czy compose uruchamia je odpowiednio

# Zadanie 8

Rozbuduj któryś serwis deliveroo:
- `wms-api`
- `tms-api`
I wygeneruj kilka przykładowych testów
(CRUD na bazie) w oparciu o test containers:
- `GET /<kolekcja>`
- `DELETE /<kolekcja>/id`
- `PUT_lub_PATCH /<kolekcja>/id`
