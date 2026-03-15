# TMS API – testy kontraktowe (Schemathesis)

Testy kontraktowe oparte o specyfikację OpenAPI. Schemathesis generuje przypadki testowe (w tym brzegowe) i weryfikuje zgodność implementacji z kontraktem.

## Wymagania

- Python 3.10+
- [uv](https://docs.astral.sh/uv/) – menedżer pakietów
- Działająca instancja TMS API (np. `docker compose up -d` w katalogu `tms`)

## Instalacja

```bash
uv sync
```

## Uruchomienie testów

### Przez Pytest (zalecane w CI)

```bash
# API domyślnie na http://localhost:3000
uv run pytest tests/test_contract.py

# Inny adres API
API_BASE_URL=http://localhost:8000 uv run pytest tests/test_contract.py
```

### Przez CLI Schemathesis (szybszy feedback)

```bash
uv run schemathesis run ../tms-api/contract/openapi.yaml \
  --base-url http://localhost:3000 \
  --checks all
```

## Konfiguracja

| Zmienna | Domyślna wartość | Opis |
|---------|------------------|------|
| `API_BASE_URL` | `http://localhost:3000` | Adres działającej instancji API |

### Autoryzacja

Jeśli API wymaga tokenu, przekaż nagłówki w `tests/test_contract.py`:

```python
case.call_and_validate(
    base_url=base_url,
    headers={"Authorization": "Bearer YOUR_TOKEN"}
)
```

Lub użyj pliku `schemathesis.toml` (patrz [dokumentacja](https://schemathesis.readthedocs.io/en/latest/reference/configuration/)).

## Kontrakt

Kontrakt OpenAPI: `../tms-api/contract/openapi.yaml`
