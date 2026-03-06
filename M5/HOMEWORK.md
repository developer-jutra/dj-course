# Zadanie 1

**Przeanalizuj rozmowę** grupy specjalistów działu logistycznego (Alice, Bob, Charlie).

Na tej podstawie **zidentyfikuj user stories** oraz sporządź dokładne **example mapping**.

Dla punktów niejasnych/wątpliwych:
- tam gdzie temat wymagałby "dłuższej rozkminy" - użyj CZERWONYCH KARTECZEK (patrz: Example Mapping)
- tam gdzie REGUŁA jest jasna i brakuje jedynie konkretnego przykładu - aby sobie ułatwić - podpytaj LLM/DeepResearch
  - PRZYKŁAD:
    **REGUŁA**: całkowita waga nie może być przekroczona
    **NIEWŁAŚCIWY EXAMPLE**: DMC nie może być przekroczone
    jak sobie poradzić:
        przykładowy prompt: _ile wynosi DMC dla TIRa?_
        przykładowa odpowiedź LLMa: _40 ton: Podstawowy limit dla większości zestawów złożonych z 3-osiowego ciągnika i 2- lub 3-osiowej naczepy (łącznie 5 lub 6 osi). [...]_
        przykład: 👉 https://gemini.google.com/share/769f97c29bf8 👈
    **GOOD ENOUGH EXAMPLE** - przykłady:
        - Ciągnik 3-osiowy ma DMC 40 ton a waga towaru wynosi 30 ton - waga nie jest przekroczona
        - Ciągnik 2-osiowy ma DMC 40 ton a waga towaru wynosi 30 ton - waga nie jest przekroczona

WAŻNE:
- nie chodzi o to aby robić miliardy przykładów. Chodzi o to aby złapać, że:
- REGUŁA ma być REGUŁĄ. Reguła nie brzmi "_waga całkowita_" tylko "_całkowita masa nie może przekraczać DMC_"
- PRZYKŁAD ma być PRZYKŁADEM. "_nie przekracza DMC_" to nadal reguła a nie przykład - ten może brzmieć - patrz jw.
- jedno USER STORY na 50 przykładów to zapewne zdecydowanie za dużo ;) podczas implementacji niekoniecznie upchniesz 50 reguł w jedną klasę czy funkcję. Dlaczego zatem wpychał(a)byś wszystko w 1 user story? [Divide and Conquer](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm).

👉 **Pliki - w folderze `HOMEWORK-dzial-logistyki`** 👈

# Zadanie 2

Zwizualizuj/zaplanuj strategię rozwoju swoich kompetencji - jako **Specjalisty**.
Przy użyciu **Wardley Mapping**:
- Jaką wartość dostarczasz swojemu klientowi?
- Które zdolności są w commodity-...-genesis?
- Co jest dla klienta widoczne, a co nie?
- W jaki sposób mapa będzie się zmieniać wraz z upływem czasu?

# Zadanie 2 (alternatywnie)

Przeprowadź research działalności wybranego **giganta technologicznego**.

Zilustruj **wartości** jakie oferuje **klientom korporacyjnym** - w formie **Mapy Wardleya**.

Uwzględnij na mapie m.in. AI oraz wybrane sztandarowe produkty (tego giganta) oraz uargumentuj ich pozycję na mapie.

# Zadanie 3

W Twoim obecnym/ostatnim (**komercyjnym**) projekcie…
przeanalizuj kontekst biznesowy / problem rozwiązywany dla klienta.

Zidentyfikuj ewentualne **procesy biznesowe**.
Zilustruj je przy użyciu **domain storytelling**.

Usuń “niejawne” szczegóły domenowe / tajemnice firmowe.
Przedstaw rezultat! 💪
