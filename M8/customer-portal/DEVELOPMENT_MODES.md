# Development Modes - Dwa sposoby uruchomienia

## 🎯 Dostępne tryby

Aplikacja może być uruchomiona na dwa sposoby:

### 1️⃣ **Tryb pełny Docker** (Nuxt + MongoDB w Docker)
### 2️⃣ **Tryb hybrydowy** (tylko MongoDB w Docker, Nuxt lokalnie)

---

## 1️⃣ Tryb pełny Docker

**Kiedy używać:**
- ✅ Pierwsza konfiguracja projektu
- ✅ Produkcyjne środowisko developerskie
- ✅ Potrzebujesz izolacji środowiska
- ✅ Pracujesz na różnych projektach jednocześnie

**Jak uruchomić:**

```bash
cd M8/customer-portal

# Uruchom wszystko w Docker
./scripts/start.sh

# Alternatywnie - bezpośrednio docker compose
docker compose up -d
```

**Dostęp:**
- Frontend: http://localhost:4003
- MongoDB: mongodb://root:example@localhost:27017/customer_portal?authSource=admin

**Zmienne środowiskowe:**
- Ustawiane automatycznie przez `docker-compose.yml`
- `MONGODB_URI=mongodb://root:example@cp-mongodb:27017/customer_portal?authSource=admin`
- `HOST=0.0.0.0` (aby kontener był dostępny z localhost)

**Logi:**
```bash
# Wszystkie logi
docker logs -f cp-container

# Przez skrypt
./scripts/logs.sh frontend
```

**Restart po zmianach:**
```bash
# Hot reload działa automatycznie dzięki volume mounting
# Jeśli potrzebny restart:
docker compose restart cp
```

---

## 2️⃣ Tryb hybrydowy (MongoDB w Docker, Nuxt lokalnie)

**Kiedy używać:**
- ✅ Szybszy development (lepszy HMR)
- ✅ Łatwiejszy debugging w IDE
- ✅ Dostęp do Node.js debuggera
- ✅ Lepsza integracja z Cursor/VSCode
- ✅ Szybsze instalowanie pakietów npm

**Jak uruchomić:**

```bash
cd M8/customer-portal

# Terminal 1 - Uruchom tylko MongoDB w Docker
./scripts/start-mongo-only.sh

# Terminal 2 - Uruchom Nuxt lokalnie
cd cp-frontend
npm run dev:local
```

**Dostęp:**
- Frontend: http://localhost:3000 (standardowy port Nuxt)
- MongoDB: mongodb://root:example@localhost:27017/customer_portal?authSource=admin

**Zmienne środowiskowe:**
- Ustawiane przez npm script `dev:local`
- `MONGODB_URI=mongodb://root:example@localhost:27017/customer_portal?authSource=admin`

**Logi:**
- Bezpośrednio w terminalu gdzie uruchomiłeś `npm run dev:local`

**Restart po zmianach:**
- Hot Module Replacement (HMR) działa szybciej
- Ctrl+C i ponownie `npm run dev:local` jeśli potrzebny restart

---

## 📊 Porównanie trybów

| Aspekt | Pełny Docker | Hybrydowy |
|--------|-------------|-----------|
| **Szybkość HMR** | Wolniejszy | Szybszy ⚡ |
| **Izolacja** | Pełna ✅ | Częściowa |
| **Debugging** | Trudniejszy | Łatwiejszy ✅ |
| **Port** | 4003 | 3000 |
| **npm install** | Wymaga rebuildu | Natychmiastowy ✅ |
| **Zużycie RAM** | Więcej | Mniej ✅ |
| **Pierwszy setup** | Łatwiejszy ✅ | Wymaga npm install |

---

## 🔧 Szczegółowe instrukcje

### Pełny Docker - Krok po kroku

```bash
# 1. Przejdź do folderu projektu
cd M8/customer-portal

# 2. Uruchom wszystko
./scripts/start.sh

# 3. Otwórz przeglądarkę
open http://localhost:4003

# 4. Zobacz logi (opcjonalne)
./scripts/logs.sh frontend

# 5. Zatrzymaj gdy skończysz
docker compose down
```

### Hybrydowy - Krok po kroku

```bash
# 1. Przejdź do folderu projektu
cd M8/customer-portal

# 2. Uruchom tylko MongoDB (Terminal 1)
./scripts/start-mongo-only.sh

# 3. W nowym terminalu (Terminal 2)
cd cp-frontend

# 4. Sprawdź czy node_modules istnieją
# Jeśli nie, uruchom:
npm install

# 5. Uruchom Nuxt lokalnie
npm run dev:local

# 6. Otwórz przeglądarkę
open http://localhost:3000

# 7. Zatrzymaj gdy skończysz:
# - Terminal 2: Ctrl+C
# - Terminal 1: docker compose stop cp-mongodb
```

---

## 📝 Dostępne npm scripts

W pliku `cp-frontend/package.json`:

```json
{
  "scripts": {
    "dev": "HOST=0.0.0.0 nuxt dev",
    "dev:local": "MONGODB_URI=mongodb://root:example@localhost:27017/customer_portal?authSource=admin nuxt dev",
    "dev:docker": "HOST=0.0.0.0 MONGODB_URI=mongodb://root:example@cp-mongodb:27017/customer_portal?authSource=admin nuxt dev"
  }
}
```

**Wyjaśnienie:**

- **`dev`** - Standardowy skrypt, używa zmiennej środowiskowej z systemu
- **`dev:local`** - Dla trybu hybrydowego (MongoDB w Docker, Nuxt lokalnie)
- **`dev:docker`** - Dla pełnego Dockera (explicite ustawia wszystkie zmienne)

---

## 🌐 Connection Strings

### Z wnętrza kontenera Docker:
```
mongodb://root:example@cp-mongodb:27017/customer_portal?authSource=admin
```
- Używa nazwy kontenera `cp-mongodb` jako hostname
- Docker Compose automatycznie rozwiązuje DNS

### Z localhost (poza Dockerem):
```
mongodb://root:example@localhost:27017/customer_portal?authSource=admin
```
- Używa `localhost` zamiast nazwy kontenera
- Port jest zmapowany przez docker-compose (27017:27017)

---

## 🔄 Przełączanie między trybami

### Z Docker → Lokalnie

```bash
# 1. Zatrzymaj kontener frontendu (ale zostaw MongoDB)
docker compose stop cp

# 2. Uruchom frontend lokalnie
cd cp-frontend
npm run dev:local
```

### Z Lokalnie → Docker

```bash
# 1. Zatrzymaj lokalny Nuxt (Ctrl+C)

# 2. Uruchom kontener frontendu
docker compose start cp

# lub uruchom wszystko na nowo
cd ..
./scripts/start.sh
```

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to MongoDB" (tryb lokalny)

**Sprawdź czy MongoDB działa:**
```bash
docker ps | grep cp-mongodb
```

Jeśli nie ma, uruchom:
```bash
./scripts/start-mongo-only.sh
```

### Problem: Port 3000 zajęty (tryb lokalny)

**Opcja 1:** Zatrzymaj inną aplikację na porcie 3000

**Opcja 2:** Użyj innego portu:
```bash
PORT=3001 npm run dev:local
```

### Problem: Stare zmienne środowiskowe

Jeśli przełączasz tryby i masz problemy:
```bash
# Wyczyść terminal i zmienne
unset MONGODB_URI
unset HOST

# Uruchom ponownie
npm run dev:local
```

### Problem: "Module not found" (tryb lokalny)

Zainstaluj zależności:
```bash
cd cp-frontend
npm install
```

### Problem: Wolny HMR w Docker

**Rozwiązanie:** Przełącz się na tryb hybrydowy

```bash
docker compose stop cp
cd cp-frontend
npm run dev:local
```

---

## 💡 Najlepsze praktyki

### Dla codziennego developmentu:
```bash
# Używaj trybu hybrydowego
./scripts/start-mongo-only.sh    # Raz dziennie
cd cp-frontend && npm run dev:local  # W osobnym terminalu
```

### Dla testowania pełnej konfiguracji:
```bash
# Używaj pełnego Dockera
./scripts/start.sh
./scripts/verify-setup.sh
```

### Przed commitem:
```bash
# Przetestuj w pełnym Docker
docker compose down
./scripts/start.sh
./scripts/verify-setup.sh
```

---

## 🎓 Rekomendacje

| Sytuacja | Rekomendowany tryb |
|----------|-------------------|
| Pierwszy raz z projektem | 🐳 Pełny Docker |
| Codzienny development | 🔄 Hybrydowy |
| Debugging backendu | 🔄 Hybrydowy |
| Testing deployment | 🐳 Pełny Docker |
| CI/CD | 🐳 Pełny Docker |
| Demo dla klienta | 🐳 Pełny Docker |
| Dodawanie nowych features | 🔄 Hybrydowy |
| Instalowanie npm packages | 🔄 Hybrydowy |

---

## 📚 Więcej informacji

- [QUICK_START.md](./QUICK_START.md) - Szybki start guide
- [COMMANDS.md](./COMMANDS.md) - Wszystkie dostępne komendy
- [README.md](./README.md) - Pełna dokumentacja
