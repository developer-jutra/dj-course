# Zadanie 1

TASK: Zmontuj typowe operacje CRUD dla struktury magazynu + opracuj kontrakt + zmontuj `.http` aby móc szybko testować API

JAK:
- wstępną wersję (wyjściowy schemat bazy) - już masz (`wms-data-generator/schema/...`)
- CRUDowych operacji na strukturze magazynu praktycznie nie ma
- możesz, ale nie musisz się trzymać konwencji istniejących endpointów w WMS

CEL: zmontować (niezbyt skomplikowane) CRUDy LLM-em skutecznie, szybko, ale i bez odwalania chałtury.

HINT #1:
- nie zdziwi mnie, jeśli nie chce Ci się drobiazgowo czytać tabeli jednej po drugiej, kolumny jednej po drugiej (aby sprawdzić, czego brakuje), etc.
- od czego masz LLMy - określ co jest Twoim celem, wskaż pliki które są w projekcie istotne, dobierz model (silny/drogi, słabszy/tańszy/szybszy? 🤔)
- nadal wypadałoby się upewnić, czy nie dostałeś/aś halucynacji w odpowiedzi, czy model zrozumiał czego w ogóle chcesz - ale przynajmniej nie zaczynasz od zera, czarną robotę wstępnego rozpoznania już zrobił :)

HINT #2:
- czy toporne "CREATE READ UPDATE DELETE" (każda operacja po kolei, czy się stoi czy się leży) dla absolutnie każdej encji będzie najwygodniejszym API? 🤔😅
- jakiego API user/frontend wy oczekiwał i/lub jakie byłoby wygodne?

STRUKTURA MAGAZYNU:
- Magazyn,
- Strefa,
- Rząd,
- Szafa,
- Półka + pojemność

DLA CHĘTNYCH: ręcznie połóż bazę (np. wyłaczając kontener dockerowy). Każ AI-owi obsługiwać ten przypadek błędu (i inne np. wyjątek rzucony z klienta bazodanowego).

# Zadanie 2

(**analogicznie do Zadania 1**, z tą różnicą, że tutaj modelujesz samodzielnie bazę)

TASK: Zmontuj typowe operacje CRUD dla katalogu pojazdów + opracuj kontrakt + zmontuj `.http` aby móc szybko testować API

KATALOG POJAZDÓW:
- Modele/marki pojazdów
- Egzemplarze (numery rej., daty, dokumenty, przebieg, krótka historia)
- Rozróżnij ciągniki siodłowe od naczep i ich rodzajów

DLA CHĘTNYCH: (analogicznie) ręcznie połóż bazę i sprawdź czy wygenerowany kod API taki przypadek ogarnia. A jeśli nie ogarnia, to zadaj sobie "follow-up question": **ilu innych (bardziej lub mniej oczywistych) rzeczy nie osbługuje kod wypluty przez LLMa, jeśli go ręcznie nie poinstruujesz w tym kierunku**?

# Zadanie 3

TASK: pokryć istniejące API kontraktem (tu: swagger).

JAK:
- oczywista oczywistość: trzeba zrobić sam(e) plik(i) .yaml/swagger 
- ale taki "martwy" plik jest mało użyteczny, dopóki nie będzie częścią automatyzacji, więc pokryj następujące aspekty:
  - runtime type checks
  - sprawdzanie poprawności parametrów (params z query stringów/URLa, z payloada, headery, etc)
  - sprawdzanie samej odpowiedzi (brzmi ogólnie? :) chodzi o to aby zweryfikować np. czy jeśli ma być zwracane 200, 400 albo 503 - to czy faktycznie API to robi. Jak? :) )
  - kontrakt ma się dać zobaczyć (statyczny plik html wystarczy, cokolwiek) + ma się dać ów dokument regenerować
- w tym celu najpierw trzeba rozpoznać tooling. WMS jest zaimplementowany w pythonie

CEL: wchodzisz w bardziej lub mniej **nieznane sobie API** i masz je szybko/efektywnie/skutecznie pokryć kontraktem, aby później móc łatwo automatyzować/synchronizować niektóre aspekty implementacji.

# Zadanie 4

TASK: Przejdź typowy scenariusz testów kontraktowych w oparciu o Pact/TMS (czyli najbardziej typowy sposób pracy z CDC)

JAK:
- usługi TMS (+ baza danych itp) oraz sam pact broker muszą być uruchomione
- obecna implementacja/konfiguracja Pact/TMS uwzględnia jedynie endpointy /customers i /transportation-orders które nas NIE interesują zupełnie. **Kontrakt pod planowanie ładunku musisz dodać** (Ty albo Twój wierny LLM)
- Implementacja planowania ładunku już jest - Ciebie interesują tylko/aż testy kontraktowe
  - pliki `.cargo-plans.http` i `.all.http` pokazują pełny flow E2E planowania ładunku
- konsument (np. analogiczny skrypt node, python, cokolwiek ktokolwiek lubi) przechodzi przez scenariusz planowania ładunku. To jest do zrobienia.
- przechodzisz proces, obserwujesz jak kolejne wersje kontraktu są dodawane
- na koniec: "can i deploy"

HINT:
- pamiętaj, że **Consumer test (generowanie kontraktu) łączy się z mockiem Pact**, nie z uruchomionym TMSem. Może to nie być oczywiste od razu, i zadanie ma właśnie na celu praktyczne przejście przez całość od A do Z i ewentualny powrót z pytaniami ;)

JAK (część druga):
- nieznacznie MODYFIKUJESZ kontrakt, np. usuwasz `trailer capabilities`, albo z info o towarze usuwasz `requirements`. Albo nie usuwasz, tylko zmieniasz nazwy pól - nevermind - robisz jakąś "łamiącą zmianę" (łamiącą wcześniejszy kontrakt np. poprzez usunięcie pola które było potrzebne) albo niełamiącą (dodanie nowego pola które nie łamie wcześniejszych zachowań)
- uruchamiasz "CAN I DEPLOY", dostajesz odpowiedź - czy ta odpowiedź jest dla Ciebie zrozumiała?
  - jeśli dodałeś/aś pola (które wcześniej nie istniały), to czy logiczne jest, kogo powinno dać się zdeployować?
  - jeśli usunąłeś/ęłaś lub przenazwiłeś/aś pole - analogicznie - czy logiczne jest, whom "CAN I DEPLOY"?

CEL: złapanie (poprzez praktykę) że - w podstawowej formie - do tego właśnie służy CDC - dzięki bardzo granularnej kontroli wyłapujemy kto może robić co i po kim, niczym w diagramnie Gantta.

# Zadanie 5

TASK: Dodaj brakujące runtime type checks w module TMS cargo plans (planowanie ładunku)

JAK:
- kontrakt już mamy, stuff wygenerowany na podst. kontraktu (np. zod) też mamy - ale przykładowego zoda jeszcze nie wykorzystujemy w pełni
- obecna implementacja endpointów używa typów wygenerowanych na podstawie kontraktów
- czego brakuje: nie sprawdzamy czy "request params", "request body", "request query" są zgodne z tym co w kontrakcie. A do tego właśnie służą zod schemy. Trzeba je po prostu zwalidować wewn. implementacji endpointów.
- wymuś na LLMie aby w implementacji endpointa sprawdzał parametry endpointów HTTP: query string, URL params, headers, payload, responses.

DODATKOWO:
- sprawdzanie czego powinno być w której warstwie (domeny, infrastruktury, aplikacji)? Sprawdzając, czy to rodzaje palet czy rodzaj towaru - co należy sprawdzać w infrze, co w domenie... czy wszystko jedno? Jeśli nie wskażemy, gdzie LLM wrzuci IFy?

CEL: zadbaj o to, co może "pójść nie tak" (klient wysyła żądanie z błędnymi danymi/formatem, a API musi to wychwycić). A najlepiej - wyeliminuj to :)

# Zadanie 6

TASK: **przemodeluj bounded context** w taki sposób, aby obsługiwać ciężarówki ze zintegrowanymi naczepami (nie-TIRy).

DLACZEGO RÓŻNICA JEST ISTOTNA:
- przy obecnym modelu (again, domena) możemy całe planowanie ładunku przeprowadzić w oparciu o wymagany/zakładany typ naczepy. Sam w sobie ciągnik siodłowy ma marginalne znaczenie - podjedzie ten albo inny - byle udźwignął towar (tego nasz moduł nie robi).
- jeśli mamy obsługiwać mniejsze ciężarówki bez podmienianych naczep, musimy już na początku planowania uwzględnić jaki będzie typ pojazdu.
  - a skoro o udźwigu mowa, to - dla uproszczenia, dodamy tylko 1 sprawdzenie - musimy się upewnić, czy taki fiat ducato (czy cokolwiek) w ogóle udźwignie palety z całym towarem jaki właśnie planujemy. Wcześniej to sprawdzenie mogło się odbyć później - teraz - niekoniecznie.

JAK:
- najpierw zamodelujesz/zaplanujesz a dopiero potem zaimplementujesz (Ty i/lub oczywiście Twój LLM)
- bardzo dokładnie zaplanuj co ma w ogóle być zmienione (design first, nie spiesz się do promptowania/pisania kodu)
  - zidentyfikjuj które elementy wymagają zmian
  - upewnij się, czy rozumiesz
- konkretne Nie-TIRy (które ma osbługiwać deliveroo):
  - FIAT DUCATO
  - RENAULT MASTERS
  - MAN TGL... i wystarczy
  - ewentualną specyfikację ww. pojazdów weź z neta/LLMa.
- Dostosuj kod i kontrakt - apka ma działać

HINT: zadanie "przemodeluj cargo plans" brzmi poważnie. Ale przecież (i celowo) nie mówię, co konkretnie i gdzie ma być zmienione. To Ty masz to znaleźć. I czy zmian będzie dużo czy mało, i czy będą inwazyjne czy nie - to Ty masz zidentyfikować/zaplanować.

CEL: ćwiczenie umiejętności modelarskich, m.in. redefiniowania modelu (jakie dane znajdują się w module, jak są wykorzystywane, jakie reguły są na ich bazie sprawdzane). Bo to co jest pewne, to że wymagania biznesowe będą się zmieniać - a to może kwestionować (bardziej lub mniej) nasze granice modelu.

PYTANIE DODATKOWE:
- do tej pory "planowaliśmy ładunek" w oderwaniu od konkretnego egzemplarza/modelu naczepy. Robiliśmy sam plan który klient potencjalnie akceptował/negocjował, naczepa/ciągnik były rezerwowane później.
- planowanie ładunku w oparciu o naczepy nigdzie się nie wybiera - nadal będzie w systemie wykorzystywane i to bardzo.
- nowe planowanie jest trochę podobne (układanie palet, sprawdzanie tych wszystkich towarów, metrów bieżących TIRa itp) a trochę NIEpodobne (bo później rezerwujemy tylko 1 pojazd - całą ciężarówkę)
- wreszcie pytanie: **czy to powinien być ten sam moduł (co do tej pory) czy może inny? I DLACZEGO?**

# Zadanie 7

TASK: zaprojektuj wzorce taktyczne (i granice modułu)

Moduł: TMS / transport-reservation

JAK:
- **NIE kodujemy - tylko projektujemy**
- chcemy “widzieć” - poza wzorcami taktycznymi - także granice spójności, reguły, stan
- **szczegóły - w pliku `HOMEWORK-transport-reservations.md`**

CEL: ćwiczenie umiejętności modelowania.

# Zadanie 8

TASK: dostosowanie TMS do zmienionych wymagań biznesowych (możemy przekroczyć DMC o 200kg bez kar)

BIZNES MÓWI:
> wiesz co, dowiedziałem się, że nasz system super skrupulatnie bada, czy dopuszczalna masa całkowita nie jest przekroczona. Wiadomo, że przepisów nie można łamać… ale wiesz…” ;) - “jest niepisana umowa, że jeśli PRZEKROCZYMY dopuszczalną masę całkowitą pojazdu tak do 200 kg max - to się nie czepiają. No a my moglibyśmy zawsze przewieźć tą jedną paletę więcej

JAK:
- system ma dopuszczać DMC przekroczone max o 200kg :)
- zanim w ogóle spojrzysz w kod - jak myślisz - jaka klasa/funkcja/plik powinna zrealizować tą zmianę? Jaki element/building block? Kto za to odpowiada?
- zaimplementuj
- dodaj odpowiednie testy gherkin/BDD.

# Zadanie 9

TASK: zamodeluj (i zaimplementuj) value object(y), zastępując wystąpienia `number`

PO CO?
- (powtórka z lekcji) nadużywanie prymitywów (number, string) niesie ryzyka związane m.in. z umożliwieniem operacji która jak najbardziej jest technicznie poprawna (np. mnożenie w zbiorze liczb) i jednocześnie zupełnie bezsensowna w zbiorze wartości domenowych (mnożenie złotówek). O kwestii ujednoliczenia możliwych operacji (na value objekcie) i większej przejrzystości kodu (widać gdzie dany domenowy typ jest wykorzystywany, i nie trzeba buszować po setkach wystąpień `number`) nie wspominając

JAK:
- przeanalizuj miejsca wystąpień `number` i szukaj tych które odnoszą się do długości (1D), obszaru (2D) lub kubatury (3D). Wiadomo, kto zrobi brudną robotę ;)
- kluczowe: zaproponuj/zamodeluj, jakie value objecty pasowałyby do tych konkretnych zastosowań
- przeimplementuj, przetestuj, sprawdź poprawność zmian

CEL: praktyka z value objectami, ćwiczenie "umiejętności modelarskich"

# Zadanie 10

Follow-up zadania 9:

TASK: Rozważ, czy długość (1D) oraz LDM (metr bieżący TIRa) - gdybyśmy chcieli dla nich mieć value objecty - to powinna być ta sama klasa value objecta czy osobna? **Od czego to zależy?**

# Zadanie 11

TASK: znajdź arytmetyczne operacje na wagach, wymiarach itp. i ukryj je w "domenowych" metodach.

JAK:
- odpowiednio spromptuj LLMa, aby znalazł Ci "podejrzane miejsca" i potencjalnie je pogrupował. Twój wkład w dalsze decyzje (dot. przemodelowania) jest kluczowy - Ty masz podjąć decyzje dot. kierunku zmian.
- mając propozycję zmian, promptujesz LLMa do implementacji; testujesz, sprawdasz czy działa poprawnie, case closed :)

CEL: praktyka z podejściem domenowym, modelowanie

DODATKOWO:
- Jak zapobiec problemowi w przyszłości?
