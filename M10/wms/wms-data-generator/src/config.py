import os

# Get mode from environment variable, default to SMALL
MODE = os.getenv("DATA_MODE", "SMALL").upper()

# Get verbose flag from environment variable, default to FALSE
VERBOSE = os.getenv("VERBOSE", "FALSE").upper() == "TRUE"

DATA_QUANTITIES_SMALL = {
    "NUM_LOCATIONS": 3,
    "NUM_WAREHOUSES": 3,
    "NUM_ZONES": 5,
    "NUM_AISLES": 7,
    "NUM_RACKS": 10,
    "NUM_SHELVES": 15,
    "NUM_CONTRACTORS": 50,
    "NUM_EMPLOYEES": 20,
    "NUM_STORAGE_REQUESTS": 200,
    "NUM_STORAGE_RECORDS": 4,
    "NUM_PAYMENTS": 40,
    "NUM_CARGO_EVENT_HISTORY": 4
}


DATA_QUANTITIES_LARGE = {
    # Infrastruktura (3-4 centra logistyczne w Polsce, np. Warszawa, Poznań, Wrocław)
    "NUM_WAREHOUSES": 4,
    "NUM_ZONES": 20,          # Np. strefa przyjęć, wydań, wysokiego składowania, chłodnia, ADR
    "NUM_AISLES": 120,        # Średnio 30 alejek na magazyn
    "NUM_RACKS": 1200,        # 10 regałów w każdej alejce
    "NUM_SHELVES": 6000,      # 5 poziomów składowania
    "NUM_LOCATIONS": 25000,   # Sumaryczna liczba miejsc składowych (miejsca paletowe + półkowe)

    # Kontrahenci i Kadry
    "NUM_CONTRACTORS": 800,   # Dostawcy i klienci (B2B) gromadzeni przez lata
    "NUM_EMPLOYEES": 150,     # Magazynierzy (3 zmiany), biuro, logistyka, kierowcy

    "NUM_STORAGE_REQUESTS": 50000,     # Zlecenia przyjęcia/wydania (ASN/Release Orders)
    "NUM_STORAGE_RECORDS": 150000,     # Konkretne pozycje (linie) na zleceniach
    "NUM_PAYMENTS": 45000,             # Faktury i płatności powiązane z usługami
    "NUM_CARGO_EVENT_HISTORY": 600000  # Pełny audit log: ruchy wewnątrzmagazynowe, skany, zmiany statusów
}


def get_data_quantities(mode: str = None) -> dict:
    if mode is None:
        mode = MODE
    else:
        mode = mode.upper()
    
    if mode == "LARGE":
        return DATA_QUANTITIES_LARGE
    return DATA_QUANTITIES_SMALL


DATA_QUANTITIES = get_data_quantities()