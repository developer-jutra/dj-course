# ZADANIE (overview)

- zamodeluj bazę + zaimplementu: **tabele, kolumny, indeksy + query**
- endpointy API HTTP (python/flask) - opcjonalnie
- DoD: parametry z requesta HTTP da się zmapować na parametry w query SQL, uruchamiasz - działa (+ są indeksy)

## SETUP (pliki/foldery)

- rozbuduj API z `M8/wms` (wraz z całym setupem dockerowym/posgresowym/pythonowym)
  - w szczególności interesuje Cię: `M8/wms/postgres/init-scripts/wms-latest.sql` (tym plikiem "ustawiasz" całą bazę)
  - ale żeby wygenerować nowe dane (CREATE TABLEs + INSERTy -> w 1 plik SQL) - do tego masz cały generator tu: `M8/wms/wms-data-generator`. W razie potrzeby obadaj `M8/wms/Taskfile.yml` - jest tam task `task generate-sql` który uruchamia generator danych
- `.http` - plik - punkt odniesienia - który opisuje endpointy które istniałyby na API
  - jeśli chcesz, implementuj endpointy + SQL
  - jeśli nie chcesz, implementuj samą część SQL

## MODUŁ STORAGE (opis funkcjonalny)

System musi obsługiwać różnorodny asortyment, od elektroniki po chemię. Kluczowe aspekty to: rozmaite cechy towaru w zależności od kategorii oraz śledzenie historii zmian atrybutów dla celów audytowych.

Analiza wymagań dostarczona przez analityka biznesowego:

- Identyfikacja i klasyfikacja
    - Aby klient mógł wprowadzić towar do systemu, magazynier musi najpierw wybrać predefiniowaną grupę asortymentową (np. "Elektronika", "Chemia"). System musi więc przechowywać **słownik kategorii**, który narzuca podstawowy kontekst. Dla każdego konkretnego towaru system musi zapamiętać jego nazwę handlową oraz wagę, która jest kluczowa dla logistyki transportowej i obliczeń obciążenia regałów.
- Unikalny paszport techniczny - Metadata
    - Ponieważ różne towary mają skrajnie inną charakterystykę, system musi przechowywać atrybuty **ELASTYCZNIE**: dla laptopa będzie to numer seryjny i wersja systemu, a dla substancji żrącej – klasa zagrożenia ADR i data ważności (skorzystaj z przykładów w pliku `.http` - po prostu - mają być różne i jeszcze mogą się zmieniać z czasem). System **musi "widzieć"** te dane jako integralną część towaru, aby podczas wyszukiwania (np. po fladze `fragile`) mógł błyskawicznie wskazać klientowi jednostki wymagające specjalnej ostrożności.
- Zarządzanie cyklem życia i serwisem
    - Hipotetyczny interfejs (niekodujemy go) musi umożliwić serwisantowi aktualizację pojedynczych cech (np. wgranie nowszego softu) bez ryzyka utraty pozostałych informacji (jak data produkcji). System musi zatem potrafić **nadpisywać wybrane fragmenty danych wewnątrz paszportu technicznego**, zachowując spójność całego opisu przedmiotu.
- Analityka zasobów i wydajność
    - Kierownik magazynu potrzebuje raportów operacyjnych, np. "jaka jest łączna waga towarów o określonej objętości", gdzie objętość jest cechą dynamiczną (nie każdy towar ją posiada). Aby to umożliwić, system musi potrafić **wyciągać wartości liczbowe ukryte wewnątrz metadanych** i traktować je jak zwykłe liczby do obliczeń sumarycznych, co pozwala na generowanie statystyk bez konieczności przeglądania każdego towaru z osobna.
- Transparentność i audyt
    - W branży logistycznej kluczowe jest "kto, co i kiedy zmienił". System musi więc przechowywać **pełny ślad rewizyjny (Audit Log)**. Za każdym razem, gdy zmieniają się cechy towaru (metadata), system musi zachować migawkę "jak było przed" i "jak jest po", wraz z precyzyjnym czasem operacji. Dzięki temu przy reklamacji klient może prześledzić całą historię zmian parametrów danego przedmiotu.
