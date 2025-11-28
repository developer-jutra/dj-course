# Azør the Chatdog

AZØR jest nakierunkowany tak, aby realizacja "poprzedniej" pracy domowej NIE BYŁA (w miarę możliwości) blokerem dla realizowania "następnych". Jeśli "brakuje Ci poprzedniej" - po prostu weź kod bazowy i rób swoje :) Jeśli będzie jakikolwiek bloker - będzie to explicite nadmienione (np. poprzez nowy folder z kodem bazowym)

## "Changelog" funkcjonalności

Aby łatwiej było się poruszać po pracach domowych - które zadanie zostało dodane kiedy - poniżej spisane jest, jaki ficzer został zlecony/zrealizowany i kiedy.

Obecnie AZØR jest dostępny w 3 (nawet 4) implementacjach:
- [python](./M1/azor-chatdog-py)
- [node.js](./M1/azor-chatdog-js)
- [golang](./M1/azor-chatdog-golang)
- implementacja Kotlinowa [Rafała Kuźmińskiego](https://discord.com/channels/1368574062263009392/1438672501478785116/1439379701171753010): https://github.com/Coneys/azor-chatdog 😍

### Codebase: initial barks

Lokalizacja: [**M1**](./M1)

Funkcjonalności:
- konwersacje wieloturowe człowiek-model
- konwersacje zapisywane w formie sesji - do plików w folderze lokalnym użytkownika
- Terminal UI (na tym etapie brak Web UI)
- podstawowe komendy typu `/session ___`, `/help` itp.
- API klienckie: `llama-cpp-python`, `google-genai`

### Praca Domowa: dodatkowe API klienckie

Lokalizacja: [**M1/Z12**](./M1/HOMEWORK-cz.2.md)

Funkcjonalności:
- dodać nowe API klienckie (np. OpenAI, Anthropic, transformers etc.)

### Praca Domowa: top p, top k, temperatura

Lokalizacja: [**M1/Z13**](./M1/HOMEWORK-cz.2.md)

Funkcjonalności:
- dodać obsługę parametrów (top p, top k, temperatura) dla używanych w Azorze API klienckich

### Praca Domowa: syntezacja mowy treści wątku

Lokalizacja: [**M2/Z2**](./M2/HOMEWORK.md)

Funkcjonalności:
- nadać możliwość wygenerowania dźwięku fragmentu/całości wątku przy użyciu modeli STT

### Praca Domowa: tytułowanie wątku

Lokalizacja: [**M2/Z6**](./M2/HOMEWORK.md)

Funkcjonalności:
- przy okazji rozpoczynania nowego wątku/konwersacji, automatycznie nadawać jej TYTUŁ

### Praca Domowa: wyspecjalizowani asystenci

Lokalizacja: [**M2/Z7**](./M2/HOMEWORK.md)

Funkcjonalności:
- umożliwić aplikacji wykorzystywanie wielu asystentów (spersonalizowanych) i przełączać się między nimi
