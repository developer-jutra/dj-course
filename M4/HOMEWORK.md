
# Zadanie 1

TASK: Stwórz Asystentów

JAK:
- Zdefiniuj nowe "ROLE" asystentów (np. tak jak w poprzednio w ćwiczeniu [**M2/Z7**](./M2/HOMEWORK.md) - ale niekoniecznie to musi być tylko 1 system prompt i nic więcej).
- "ROLA" technicznie może się sprowadzać do kombinacji: prompta (?) system prompta (?) a może wiele promptów (?) może sparametryzowanych (?).

**Role-Playing: Wnikliwa Sparing Partner** - przykładowo:
- niecierpliwy/a investor(ka)
- startupów technologicznych
- szuka rokujących wpływów z inwestycji
- lubi komunikację straight to the point i konkrety
- niecierpliwi się jeśli ktoś leje wodę
- dawno temu miał(a) background technologiczny, ale już jest zdecydowanie nie na czasie i zajmuje się wyłącznie biznesem
- jeśli pomysł jest naprawdę dobry, to go popiera

**Role-Playing: Angel Investor** - przykładowo:
- bada rozumienie danego zagadnienia
- zadaje trudne pytania, prowokujące do kwestionowania założeń i uproszczeń
- prowadzi rozmowę pytaniami, nie podaje gotowych odpowiedzi
- stara się zrozumieć tok myślenia rozmówcy i znaleźć luki w myśleniu
- wskazuje elementy ważne, których rozmówca nie dostrzega, argumentuje, dlaczego są istotne
- jest przyjazna ale wymagająca
- nie jest hurra optymistyczna

CEL:
- stworzenie "asystentów/ról" dla LLMów wspomagających nas w eksploracji tematów biznesowych

# Zadanie 2

**Business Model Archetypes**

Nauka z LLMami / Deep Research.
Ćwiczenie promptowania / dociekania.

TASK: Zilustruj 7 przykładowych firm (każda w innym modelu). Podstatowe wprowadzenie doarchetypów modeli **biznesowych** znajduje się w lekcji-pracy-domowej.

FINALNIE: wybierz jeden z nich (z tych 7):
- “Ubierz” w prompta
- Przedstaw Angel Investorowi
- Urealnij swoją propozycję
- Powtórz iterację 2-3 razy

I pochwal się wynikami na discordzie :)

CEL: zmienić perspektywę z technicznej na biznesową i rozmawiać językiem biznesu (kosztów, korzyści, zdolności, etc etc)

# Zadanie 3

**Zmiany Geopolityczne & Domena Logistyczna** (hipotetyczny scenariusz).

Deliveroo jest zmuszone do rozszerzenia działalności na **transport morski.**

TASK: Przeprowadź z LLMem research/symulację - jak zmieniają się:
- Interesariusze
- Zdolności
- Procesy
- Strumienie wartości

Przykład:
- jacy nowi interesariusze się pojawiają?
- czy zdolnością musi być zarządzanie własną flotą morską?
- czy zmienia się proces planowania i realizacji transportu?
- czy płatności, reklamacje itp. działają po staremu?
- c perspektywy odbiorcy zamorskiego: jak się zmienia strumień wartości? itp.

Interesuje nas głównie zmiana (“delta”) - w ujęciu i biznesu i systemu.

OCZEKIWANY WYNIK:
- rozpisane (w krótkich punktach?) najważniejsze zmiany jakie czekałyby firmę od strony architektury biznesu

CEL:
- Samodzielne przeprowadzenie eksploracji (sub)domeny biznesowej.
- Umiejętność identyfikacji elementów biznesu (interesariusze, zdolności, procesy, strumienie)
- Określanie wpływu zmian na software (i minimalizacja koniecznych zmian).

# Zadanie 4

**LLM-based Startup! & Domena Tech/AI**

KONTEKST:
Pracujesz dla startupu AI z rozbudowanym systemem agentowym. Dołączasz do zespołu.
Wybierz dowolny, w razie czego jako punkt odniesienia możemy wziąć np. Lovable (jest sporo materiałów prasowych na ich temat).

# Zadanie 4.1

TASK: przeprowadź analizę ich obecnej **architektury biznesu**. Określ:
- Interesariuszy/klientów swoich usług
- Zdolności
- Uczestników rynku
- Strumień wartości

CEL:
- zastosuj w praktyce wiedzę z lekcji
- ćwicz rozróżnianie zdolności od procesów, ćwicz identyfikowanie interesariuszy i strumieni
- mając "odeparowane" zdolności od procesów - czy widzisz potencjalne inne usługi, jakie firma już teraz mogłaby świadczyć na rzecz klientów?
- mając zidentyfikowanych interesariuszy - czy widzisz, z ich perspektywy, co jest priorytetowe, i jak można rozwijać/rozbudowywać strumienie wartości?

# Zadanie 4.2

**Shaking The Model**

KONTEKST:
- Nastaje 2027 i ceny LLM/inference 🚀 w 🌟.
- Pomysł: inicjatywa we własne modele/infrastrukturę.

TASK:
- Przeprowadź analizę: zmiana modelu biznesowego, zdolności, procesów, itp.
- Określ:
  - Czego Musimy się douczyć (kompetencje)?
  - Co musimy zbudować, co zautomatyzować?
  - Czym będziemy (dodatkowo) zarządzać

CEL:
- uświadomienie sobie, że - mimo że zmiany w biznesie są nieuchronne - to można mitygować ich wpływ na rozwój systemu
- w konsekwencji - zyskujemy nowe perspektywy patrzenia na projektowanie architektury

# Zadanie 5

AZØR - Role-playing - “Autonomiczna rozmowa”
(rozbuduj AZØRA z kodu bazowego z `M1/azor-chatdog-*`)
Bazowa implementacja znajduje się w: `M4/role-playing-chat`.

JAK:
- rozmowa ma określone np. 2 "persony" które biorą w niej udział (np. Wnikliwa Sparing Partner i Angel Investor)
- każda "persona" ma określoną rolę (poprzednie zadanie)
- inicjalny prompt pochodzi od Ciebie (człowieka), potem następuje "dialog"...
- agent zleca modelowi odpowiedź w roli persony A
- Następnie agent "przełącza" kontekst modelu na personę B - i zleca odpowiedź
- […]
- schemat dokładnie opisany w lekcji-pracy-domowej
- optymalnie byłoby, aby taki tryb konwersacyjny w AZØRZE miał swój moduł, i gdyby UI AZØRA pobierał odpowiednio info od użytkownika (wybó® asystentów, określenie prompta, możliwość przerwania konwersacji)

CEL:
- ćwiczenie umiejętności projektowania/implementowania aplikacji agentowych
