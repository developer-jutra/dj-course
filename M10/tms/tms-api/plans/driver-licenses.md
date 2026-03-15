### Propozycja struktury tabel SQL

W systemie logistycznym uprawnienia kierowców najlepiej modelować za pomocą relacji wiele-do-wielu, rozdzielając definicję uprawnienia od faktu jego posiadania przez konkretną osobę. Pozwala to na przechowywanie metadanych (np. daty ważności dokumentu).

```sql
-- Słownik rodzajów uprawnień
CREATE TABLE driver_license_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- np. 'ADR_BASIC', 'FORKLIFT'
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Tabela łącząca (relacja M:N)
CREATE TABLE driver_licenses (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    license_type_id INTEGER NOT NULL REFERENCES driver_license_types(id),
    document_number VARCHAR(50),
    issue_date DATE,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, expired, suspended
    
    CONSTRAINT unique_driver_license UNIQUE(driver_id, license_type_id)
);

-- Indeks dla wydajności wyszukiwania ważnych uprawnień
CREATE INDEX idx_driver_licenses_expiry ON driver_licenses(expiry_date);

```

---

### Domenowe rodzaje uprawnień

W transporcie drogowym uprawnienia dzielą się na kategorie prawa jazdy, uprawnienia specjalistyczne (towary niebezpieczne) oraz uprawnienia operacyjne.

#### 1. Kategorie Prawa Jazdy (Standard)

* **C / C1**: Pojazdy ciężarowe powyżej 3.5t.
* **C+E**: Ciągnik siodłowy z naczepą (podstawa w logistyce ciężkiej).
* **D**: Transport osób (jeśli firma posiada autokary/busy pracownicze).

#### 2. Uprawnienia ADR (Towary Niebezpieczne)

* **ADR Basic**: Podstawowy kurs na przewóz towarów niebezpiecznych w sztukach przesyłki.
* **ADR Tank**: Przewóz w cysternach.
* **ADR Class 1**: Materiały wybuchowe.
* **ADR Class 7**: Materiały promieniotwórcze.

#### 3. Uprawnienia Specjalistyczne i Operacyjne

* **Kierowca-Konwojent**: Uprawnienia do transportu wartości pieniężnych lub towarów wysokiego ryzyka (wymaga często wpisu na listę kwalifikowanych pracowników ochrony).
* **HDS (Hydrauliczny Dźwig Samochodowy)**: Obsługa żurawia przeładunkowego zamontowanego na pojeździe.
* **Wózki Widłowe (UDT)**: Często wymagane, gdy kierowca sam dokonuje załadunku/rozładunku (tzw. "self-loading").
* **Uprawnienia Hakowego**: Przy transporcie ponadgabarytowym lub specjalistycznym.

#### 4. Certyfikaty Sanitarne i Higieniczne

* **Książeczka Sanepidowska**: Niezbędna przy transporcie żywności (produkty świeże, chłodnicze).
* **Certyfikat ATP**: Znajomość procedur transportu towarów szybko psujących się w kontrolowanej temperaturze.

#### 5. Kwalifikacje Zawodowe

* **Kod 95**: Obowiązkowy wpis w prawie jazdy potwierdzający przejście kwalifikacji wstępnej lub szkolenia okresowego (kluczowe dla legalności pracy kierowcy w UE).
