# TMS / transport reservations (zadanie 7)

# Wymagania Biznesowe.

Funkcjonalność: Moduł ma umożliwić dalsze procesowanie planu załadunkowego - przypisać kierowcę i flotę dla planu załadunkowego w określonym oknie czasowym.

Kwestia planowania trasy oraz długości trwania transportu jest określana przez inny moduł - a do modułu "transport reservations" trafia gotowa liczba (ile dni? godzin?) określająca wymaganą dostępność.

**CEL: ma się dać "zarezerwować transport". Oznacza to przypisanie zarówno kadry jak i floty do realizacji danego zamówienia transportowego.**

W zamówieniu transportowym wiemy o szczegółach takich jak:
- rodzaj ładunku
- masa ładunku
- rodzaj naczepy
- LDM

System przechowuje informacje (w tym module? W innym?) o flocie i kierowcach. Próba zarezerwowania tego samego kierowcy w oknie czasowym w którym jest już zajęty skutkuje oczywiście błędem.

# Domena

## Kierowcy

Poza pracą, kierowca może być niedostępny w określone dni w związku z chorobą, urlopem itp.

### Uprawnienia

Każdy kierowca musi posiadać komplet: Prawo jazdy C+E + Kod 95. Prawko C+E - wiadomo. Kod 95 zaś - jest "badaniem okresowym" odnawialnym co 5 lat (do 6o r.ż.) lub co 2 lata (po 60 r.ż.). Może się zdarzyć, że kierowcy się papiery skończyły (uprawnienia wygasły) i chwilowo nie będzie dostępny.

Jeśli kierowca przewozi żywność, musi mieć aktualne badania Sanepidu.

Jeśli kierowca przewozi materiały niebezpieczne, musi mieć aktualne "zaświadczenie ADR". Niektóre towary chemiczne są również klasyfikowane jako ADR - wówczas również wymagane jest zaświadczenie ADR.

W przypadku szczególnie cennego/wartościowego ładunku, klient (zlecający transport) może "zażyczyć sobie" aby kierowca spełniał normy podwyższonego bezpieczeństwa. Sprowadza się to przeszkolenia kierowcy "szkoleniem TAPA".

## Ciągniki siodłowe

### Wysokość siodła (standard, low deck)

Odrobinka technikaliów (domeny :P)
- powszechna norma prawna wymaga aby ciągnik + naczepa miały wysokość maks. 4m. Dzięki mosty, tunele, wiadukty itp - muszą taką wysokość pojazdom swobodnie zagwarantować
- stety niestety, naczepa typu "mega" (1 z 3 obsługiwanych przez deliveroo, obok "curtainside" i "reefer") ma aż 3 metry wysokości (pojemności na ładunek) sama z siebie. Razem z ustawieniem siodła (1,15m) przekraczałaby owe 4m (smuteczek). Naczepy mega są po prostu niższe, ale to wymaga innej konstrukcji...
- naczepy mega są na tyle istotne, że stworzono dla nich specjalne ciągniki siodłowe (siodło na innej wysokości). W związku z tym ciągnik albo jest typu "STANDARD" albo "LOW DECK" (ten obniżony, pod mega).
- Teoretycznie można ciągnik przebudować (w warsztacie) z typu standard na typ low deck (i na odwrót), ale jest to bardzo nieopłacalne, nie robi się tego w praktyce. Więc de facto mamy 2 rodzaje ciągników.

### Modele ciągników

W Deliveroo wykorzystujemy następujące modele ciągników:
- Volvo FH 500
- Volvo FH 500 Low Deck
- DAF XF 480 / XG 480
- DAF XF 480 Low Deck
Każdego modelu mamy ileś tam egzemplarzy.

### Nie-TIRy

Ciężarówki-nie-TIRy ignorujemy. Dla uproszczenia załóżmy że wszystkie pojazdy w naszej flocie będą powiązane z TIRami (ciągniki, naczepy).

## Dostępność

Zarówno kierowcy jak i pojazdy mają określoną dostępność.
