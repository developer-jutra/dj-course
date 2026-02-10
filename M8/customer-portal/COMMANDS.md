# Komendy - Customer Portal

## 🚀 Podstawowe komendy

**Aplikacja wspiera dwa tryby uruchomienia.** Zobacz szczegóły w [DEVELOPMENT_MODES.md](./DEVELOPMENT_MODES.md)

### Tryb 1: Start całego stacku w Docker
```bash
cd M8/customer-portal
./scripts/start.sh
```
Frontend: http://localhost:4003

### Tryb 2: Hybrydowy (zalecany do dev)

**Terminal 1 - MongoDB w Docker:**
```bash
./scripts/start-mongo-only.sh
```

**Terminal 2 - Frontend lokalnie:**
```bash
cd cp-frontend
npm run dev:local
```
Frontend: http://localhost:3000

**Zalety:** Szybszy HMR ⚡, łatwiejszy debugging 🐛

### Zatrzymanie
```bash
# Zatrzymaj wszystko
docker compose down

# Zatrzymaj tylko MongoDB
docker compose stop cp-mongodb

# Zatrzymaj tylko frontend
docker compose stop cp
```

### Restart
```bash
# Restart wszystkiego
docker compose restart

# Restart tylko MongoDB
docker compose restart cp-mongodb

# Restart tylko frontend
docker compose restart cp
```

### Weryfikacja setupu
```bash
./scripts/verify-setup.sh
```

## 📋 Logi

### Wszystkie logi
```bash
./scripts/logs.sh
```

### Logi frontend
```bash
./scripts/logs.sh frontend
```

### Logi MongoDB
```bash
./scripts/logs.sh mongo
```

### Bezpośrednio z Docker
```bash
# Frontend
docker logs -f cp-container

# MongoDB
docker logs -f cp-mongodb-container

# Ostatnie 100 linii
docker logs --tail 100 cp-container
```

## 🗄️ MongoDB

### Połączenie z MongoDB (MongoDB Compass)
```
mongodb://root:example@localhost:27017/customer_portal?authSource=admin
```

### Shell MongoDB
```bash
docker exec -it cp-mongodb-container mongosh
```

W shell MongoDB:
```javascript
// Przełącz na bazę
use customer_portal

// Pokaż kolekcje
show collections

// Policz dokumenty
db.dashboard_stats.countDocuments()

// Pokaż wszystkie stats
db.dashboard_stats.find().pretty()

// Pokaż metrics
db.metrics.findOne()

// Pokaż recent requests
db.recent_requests.find().sort({ date: -1 })
```

### Reset bazy danych
```bash
./scripts/reset-db.sh
```

### Ręczny reset (bez skryptu)
```bash
docker compose down -v
docker volume rm customer-portal_cp-mongodb_data
docker compose up -d
```

### Backup bazy danych
```bash
docker exec cp-mongodb-container mongodump \
  --username root \
  --password example \
  --authenticationDatabase admin \
  --db customer_portal \
  --out /tmp/backup

docker cp cp-mongodb-container:/tmp/backup ./backup
```

### Restore bazy danych
```bash
docker cp ./backup cp-mongodb-container:/tmp/backup

docker exec cp-mongodb-container mongorestore \
  --username root \
  --password example \
  --authenticationDatabase admin \
  --db customer_portal \
  /tmp/backup/customer_portal
```

## 🌐 Frontend (Nuxt)

### Shell w kontenerze frontend
```bash
docker exec -it cp-container sh
```

### Rebuild frontend (po zmianach w package.json)
```bash
docker compose down
docker compose build cp
docker compose up -d
```

### Instalacja nowych pakietów
```bash
# Zatrzymaj kontener
docker compose down

# Dodaj pakiet do package.json ręcznie lub:
cd cp-frontend
npm install nazwa-pakietu

# Uruchom ponownie
cd ..
docker compose up -d
```

### Uruchomienie lokalnie (poza Dockerem)

**Opcja 1: Użyj npm script (zalecane)**
```bash
cd cp-frontend
npm run dev:local
```

**Opcja 2: Ręcznie ustaw zmienne**
```bash
cd cp-frontend
export MONGODB_URI=mongodb://root:example@localhost:27017/customer_portal?authSource=admin
npm run dev
```

**Dostępne npm scripts:**
- `npm run dev` - standardowy dev (używa zmiennych z systemu)
- `npm run dev:local` - dla lokalnego dev (MongoDB w Docker, Nuxt lokalnie)
- `npm run dev:docker` - dla pełnego Dockera (explicite ustawia zmienne)

## 🔧 Docker

### Status kontenerów
```bash
docker compose ps
```

### Restart poszczególnych serwisów
```bash
# Frontend
docker compose restart cp

# MongoDB
docker compose restart cp-mongodb
```

### Zatrzymanie z usunięciem wolumenów
```bash
docker compose down -v
```

### Usunięcie wszystkiego (kontenery + obrazy + wolumeny)
```bash
docker compose down -v --rmi all
```

### Rebuild bez cache
```bash
docker compose build --no-cache
docker compose up -d
```

## 🧪 Testowanie API

### Curl
```bash
# Stats
curl http://localhost:4003/api/dashboard/stats | jq

# Metrics
curl http://localhost:4003/api/dashboard/metrics | jq

# Recent Requests
curl http://localhost:4003/api/dashboard/recent-requests | jq

# Route Performance
curl http://localhost:4003/api/dashboard/route-performance | jq

# Quick Actions
curl http://localhost:4003/api/dashboard/quick-actions | jq
```

### HTTPie (jeśli zainstalowany)
```bash
http localhost:4003/api/dashboard/stats
http localhost:4003/api/dashboard/metrics
```

### W przeglądarce
```
http://localhost:4003/api/dashboard/stats
http://localhost:4003/api/dashboard/metrics
http://localhost:4003/api/dashboard/recent-requests
http://localhost:4003/api/dashboard/route-performance
http://localhost:4003/api/dashboard/quick-actions
```

## 🐛 Troubleshooting

### Problem: Port już zajęty

Zmień port w `docker-compose.yml`:
```yaml
services:
  cp:
    ports:
      - "4004:3000"  # Zmień 4003 na 4004
  
  cp-mongodb:
    ports:
      - "27018:27017"  # Zmień 27017 na 27018
```

### Problem: Kontener nie startuje

Sprawdź logi:
```bash
docker logs cp-container
docker logs cp-mongodb-container
```

### Problem: MongoDB nie ma danych

1. Sprawdź czy init script się wykonał:
```bash
docker logs cp-mongodb-container | grep "MONGO INITIALIZATION"
```

2. Jeśli nie, zresetuj bazę:
```bash
./scripts/reset-db.sh
```

### Problem: Frontend nie łączy się z MongoDB

1. Sprawdź czy zmienna `MONGODB_URI` jest ustawiona:
```bash
docker exec cp-container printenv | grep MONGODB
```

2. Sprawdź logi połączenia:
```bash
docker logs cp-container | grep -i mongo
```

Powinno być: `Successfully connected to MongoDB.`

### Problem: Wolne działanie

Sprawdź użycie zasobów:
```bash
docker stats
```

Możesz zwiększyć limity w Docker Desktop (Settings → Resources).

## 📊 Monitoring

### Sprawdzenie użycia zasobów
```bash
docker stats cp-container cp-mongodb-container
```

### Wielkość wolumenów
```bash
docker system df -v
```

### Czyszczenie nieużywanych zasobów
```bash
docker system prune -a
```

## 🔍 Debugowanie

### Watch mode dla logów
```bash
# Terminal 1 - Frontend logs
docker logs -f cp-container

# Terminal 2 - MongoDB logs
docker logs -f cp-mongodb-container
```

### Inspekcja kontenera
```bash
docker inspect cp-container
docker inspect cp-mongodb-container
```

### Sieć
```bash
docker network ls
docker network inspect deliveroo-network
```

## 📝 Przydatne aliasy

Dodaj do `~/.zshrc` lub `~/.bashrc`:

```bash
alias cpup='cd ~/Development/devstyle/DJ/dj-course-wip/M8/customer-portal && ./scripts/start.sh'
alias cpmongo='cd ~/Development/devstyle/DJ/dj-course-wip/M8/customer-portal && ./scripts/start-mongo-only.sh'
alias cpdown='cd ~/Development/devstyle/DJ/dj-course-wip/M8/customer-portal && docker compose down'
alias cplogs='cd ~/Development/devstyle/DJ/dj-course-wip/M8/customer-portal && ./scripts/logs.sh'
alias cpreset='cd ~/Development/devstyle/DJ/dj-course-wip/M8/customer-portal && ./scripts/reset-db.sh'
alias cpverify='cd ~/Development/devstyle/DJ/dj-course-wip/M8/customer-portal && ./scripts/verify-setup.sh'
```

Następnie:
```bash
source ~/.zshrc  # lub ~/.bashrc
```

Teraz możesz używać:
```bash
cpup        # Start całego stacku
cpmongo     # Start tylko MongoDB
cpdown      # Stop
cplogs      # Logi
cpreset     # Reset bazy
cpverify    # Weryfikacja
```
