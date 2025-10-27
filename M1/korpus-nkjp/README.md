# README

Kod powstał podczas jajwa "_gemini / python / nlp - korpus językowy_"
  - https://discord.com/channels/1368574062263009392/1431197888675057797
  - https://edu2.devstyle.pl/app/course/61b997b0-11c2-4ca5-aeb9-7ee8c4f8a472/item/8418b39d-3120-4fb9-ae95-67a73e4388e9

[NKJP](https://nkjp.pl/) 101 - co to i po co to?

1. NKJP stanowi olbrzymią, referencyjną bazę tekstów liczącą ponad 1,5 miliarda słów, niezbędną do trenowania nowoczesnych, wielkoskalowych modeli językowych.
2. Zróżnicowanie gatunkowe i tematyczne źródeł korpusu (m.in. prasa, literatura, teksty ulotne, nagrania rozmów) gwarantuje modelom językowym dostęp do zrównoważonego i wiarygodnego obrazu polszczyzny.
3. Korpus jest podstawowym zasobem do tworzenia zaawansowanej technologii językowej, w tym programów do automatycznego tłumaczenia i wyszukiwarek uwzględniających polską odmianę, co jest kluczowe dla inżynierii modeli językowych.

## Download "podkorpusu milionowego"

- wejdź na [nkjp.pl / _narzędzia i zasoby_](https://nkjp.pl/index.php?page=14&lang=0)
- albo uruchom `wget http://clip.ipipan.waw.pl/NationalCorpusOfPolish?action=AttachFile&do=get&target=NKJP-PodkorpusMilionowy-1.2.tar.gz` albo inną komendę.
- rozpakowanie (uwaga, będzie b. duo podfolderów): `tar -xvf <ARCHIWUM>.tar.gz`

## Uruchomienie

`python src/app.py` - i w `output` będą pliki z tekstami z NKJP.

Zależności - brak.
