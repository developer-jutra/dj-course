## 1. Magazyn (Storage)

Moduł magazynowania pozwala klientom na zarządzanie towarami składowanymi w magazynach firmy. Użytkownik powinien mieć możliwość wglądu w swoje zasoby magazynowe.

-   **Przeglądanie listy składowanych towarów**
    -   Cel: Umożliwienie użytkownikowi szybkiego wglądu w aktualny stan magazynowy oraz historię składowania.
    -   Wymagania:
        -   Użytkownik może wyświetlić listę wszystkich swoich towarów (jednostek magazynowych).
        -   Lista powinna prezentować kluczowe dane: ID towaru, typ ładunku, ilość, jednostka, lokalizacja w magazynie, status, data przyjęcia.
        -   Użytkownik może filtrować listę towarów po:
            -   **Statusie**, dostępne opcje:
                -   Pending (Oczekujący)
                -   In Storage (W magazynie)
                -   Dispatched (Wydany)
                -   Removed (Usunięty)
            -   **Typie ładunku**, dostępne opcje:
                -   General Cargo (Ogólny)
                -   Perishable (Łatwo psujący się)
                -   Hazardous (Niebezpieczny)
                -   Oversized (Ponadgabarytowy)
-   **Wyświetlanie szczegółów jednostki magazynowej**
    -   Cel: Zapewnienie pełnego wglądu w dane konkretnego towaru.
    -   Wymagania:
        -   Po wybraniu towaru z listy, użytkownik widzi ekran szczegółów.
        -   Ekran szczegółów powinien zawierać wszystkie dostępne informacje:
            -   ID towaru
            -   Typ ładunku
            -   Ilość i typ jednostki
            -   Lokalizacja w magazynie
            -   Aktualny status
            -   Data przyjęcia do magazynu
            -   Data planowanego lub rzeczywistego wydania z magazynu.

## 2. Przesyłki (Shipments)

Moduł przesyłek służy do zarządzania zleceniami transportowymi. Użytkownik może przeglądać swoje przesyłki oraz ich szczegóły.

-   **Przeglądanie listy przesyłek**
    -   Cel: Monitorowanie wszystkich bieżących i historycznych zleceń transportowych.
    -   Wymagania:
        -   Użytkownik widzi listę wszystkich swoich przesyłek.
        -   Lista prezentuje kluczowe informacje: numer przesyłki, numer do śledzenia (tracking number), trasa (miasto początkowe → miasto docelowe), rodzaj usługi, status, data planowanego odbioru.
        -   Użytkownik może filtrować listę przesyłek po:
            -   **Statusie**, dostępne opcje:
                -   Scheduled (Zaplanowana)
                -   Pickup Scheduled (Odbiór zaplanowany)
                -   In Transit (W tranzycie)
                -   Out for Delivery (W doręczeniu)
                -   Delivered (Dostarczona)
                -   Completed (Zakończona)
                -   Awaiting Payment (Oczekuje na płatność)
                -   Paid (Opłacona)
            -   **Rodzaju usługi transportowej**, dostępne opcje:
                -   Full Truckload (Całopojazdowy)
                -   Less Than Truckload (Drobnicowy)
                -   Express Delivery (Dostawa ekspresowa)
                -   Oversized Cargo (Ładunek ponadgabarytowy)
                -   Hazardous Materials (Materiały niebezpieczne)
            -   Dacie (zakres dat).
        -   Z poziomu listy użytkownik może przejść do:
            -   Szczegółów przesyłki.
            -   Śledzenia przesyłki na mapie (przekierowanie do modułu Tracking).
-   **Wyświetlanie szczegółów przesyłki**
    -   Cel: Zapewnienie pełnego wglądu w dane logistyczne i status konkretnej przesyłki.
    -   Wymagania:
        -   Użytkownik widzi interaktywną oś czasu pokazującą kluczowe etapy podróży przesyłki. Po kliknięciu na dany etap, wyświetlane są szczegółowe informacje:
            -   **Order Placed**: Data zamówienia, Status zamówienia, Status płatności, Czas przygotowania.
            -   **Picked Up**: Czas odbioru, Lokalizacja odbioru, Kierowca, Pojazd.
            -   **In Transit**: Czas rozpoczęcia tranzytu, Aktualna lokalizacja, Przewidywany czas przybycia, Czas trwania tranzytu.
            -   **Out for Delivery**: Czas rozpoczęcia doręczenia, Adres dostawy, Kierowca doręczający, Szacowany czas dostawy.
            -   **Delivered**: Czas dostarczenia, Odbiorca, Podpis, Status dostawy.
        -   Prezentacja ogólnego podsumowania przesyłki: status, typ usługi, priorytet, numer do śledzenia.
        -   Wyświetlanie szczegółów trasy: adresy załadunku i rozładunku.
        -   Prezentacja harmonogramu: planowane i rzeczywiste daty/godziny odbioru i dostawy.

## 3. Śledzenie (Tracking)

Moduł śledzenia umożliwia monitorowanie przesyłek w czasie rzeczywistym na mapie.

-   **Wyszukiwanie przesyłki do śledzenia**
    -   Cel: Szybkie odnalezienie przesyłki i jej aktualnej pozycji.
    -   Wymagania:
        -   Użytkownik może wprowadzić numer śledzenia (tracking number), aby wyświetlić szczegóły.
        -   System automatycznie ładuje dane do śledzenia po przejściu z modułu przesyłek.
-   **Wyświetlanie informacji o śledzeniu**
    -   Cel: Dostarczenie kompleksowych informacji o statusie, lokalizacji i historii przesyłki.
    -   Wymagania:
        -   **Mapa**:
            -   Wyświetlanie mapy z zaznaczoną planowaną trasą przesyłki.
            -   Marker wskazujący aktualną pozycję pojazdu.
            -   Markery dla kluczowych zdarzeń na trasie. Typy zdarzeń: `pickup`, `delivery`, `refuel`, `rest`, `warehouse`, `customs`, `current`.
            -   Po kliknięciu w marker, użytkownik widzi szczegóły zdarzenia:
                -   Tytuł statusu (np. "Odbiór zakończony")
                -   Nazwa miejsca (np. "Magazyn Warszawa")
                -   Opis zdarzenia.
                -   Dane czasowe:
                    -   Dla zdarzeń zakończonych: Czas planowany, Czas rzeczywisty, Różnica w minutach.
                    -   Dla zdarzeń planowanych: Szacowany czas przybycia (ETA).
        -   **Podsumowanie**:
            -   Karta z kluczowymi danymi: numer śledzenia, status, typ usługi, miejsce pochodzenia i przeznaczenia, szacowana data dostawy.
        -   **Historia zdarzeń (Timeline)**:
            -   Chronologiczna lista aktualizacji statusu przesyłki (np. "Odebrano z magazynu", "Przekroczono granicę", "Wyruszył w dalszą drogę").
