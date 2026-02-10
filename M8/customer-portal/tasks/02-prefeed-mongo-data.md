### Instrukcja inicjalizacji danych w MongoDB dla Agenta LLM

Aby MongoDB automatycznie załadowało dane przy pierwszym uruchomieniu, wykorzystamy mechanizm wolumenu `/docker-entrypoint-initdb.d/`. Skrypty `.js` umieszczone w tym folderze zostaną wykonane tylko wtedy, gdy baza danych jest tworzona po raz pierwszy (pusty wolumen danych).

#### 1. Struktura plików

Agent powinien utworzyć następującą strukturę w folderze projektu:

```text
.
├── docker-compose.yml
├── customer-portal/
└── mongodb/
    └── cp/
        └── init-db.js  <-- Tutaj definiujemy dane startowe

```

#### 2. Konfiguracja Docker Compose

Należy zmodyfikować sekcję `cp-mongodb`, aby zamapować lokalny plik inicjalizacyjny do kontenera.

```yaml
  cp-mongodb:
    image: mongo:7.0.16
    container_name: cp-mongodb-container
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      # Ta zmienna sprawi, że skrypt wykona się w kontekście konkretnej bazy
      MONGO_INITDB_DATABASE: customer_portal 
    ports:
      - "27017:27017"
    volumes:
      - cp-mongodb_data:/data/db
      # Mapowanie skryptu inicjalizacyjnego
      - ./mongodb/cp/init-db.js:/docker-entrypoint-initdb.d/init-db.js:ro
    networks:
      - deliveroo-network
    restart: unless-stopped

```

#### 3. Plik inicjalizacyjny (`mongodb/cp/init-db.js`)

Skrypt napisany w języku JavaScript (standard powłoki Mongo). Agent powinien dostosować kolekcje do logiki biznesowej.

```javascript
// Logowanie rozpoczęcia procesu
print('STARTING MONGO INITIALIZATION');

// Przełączenie na bazę docelową (zgodną z MONGO_INITDB_DATABASE)
db = db.getSiblingDB('customer_portal');

// Tworzenie kolekcji (opcjonalne, Mongo tworzy je automatycznie przy insercie)
db.createCollection('users');
db.createCollection('settings');

// Wstawianie startowych dokumentów
db.users.insertMany([
  {
    email: 'admin@example.com',
    name: 'Tomek Admin',
    role: 'superadmin',
    createdAt: new Date()
  },
  {
    email: 'user@example.com',
    name: 'Jan Kowalski',
    role: 'user',
    createdAt: new Date()
  }
]);

db.settings.insertOne({
  portalName: 'Customer Portal v1',
  maintenanceMode: false,
  maxUploadSize: 10485760
});

// Tworzenie indeksów
db.users.createIndex({ "email": 1 }, { unique: true });

print('MONGO INITIALIZATION FINISHED');

```

---

### Instrukcja wykonawcza dla Agenta

1. **Lokalizacja plików:** Utwórz folder `./mongodb/cp/` i umieść w nim plik `init-db.js`.
2. **Skrypt JS:** W pliku `init-db.js` zdefiniuj początkowe dane (seed data) za pomocą `db.collection.insertMany([...])`. Używaj standardowych obiektów JS (np. `new Date()`).
3. **Docker Config:** W pliku `docker-compose.yml` upewnij się, że ścieżka w `volumes` dla `cp-mongodb` wskazuje poprawnie na Twój plik skryptu.
4. **Ważna uwaga:** Poinformuj użytkownika, że jeśli kontener był już wcześniej uruchomiony, musi usunąć wolumen (`docker volume rm ...`), aby skrypt inicjalizacyjny zadziałał ponownie, ponieważ MongoDB uruchamia `/docker-entrypoint-initdb.d/` tylko przy czystym starcie.
5. **Weryfikacja:** Po uruchomieniu `docker compose up -d`, sprawdź logi kontenera (`docker logs cp-mongodb-container`), aby upewnić się, że widzisz komunikat "MONGO INITIALIZATION FINISHED".