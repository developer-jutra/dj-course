# Lekcja 2 (Redukowanie Halucynacji)

### Najpierw zbuduj kontekst

**zamiast**:
> Wygeneruj mi przykłady kodu ilustrujące XYZ.
najpierw zbuduj kontekst:
> Opisz mi problematykę wokół XYZ.
> (i dopiero potem:)
> Teraz proszę zilustruj przykładami kodu w określonym stylu, formacie [...]

przykład: https://gemini.google.com/share/0be5e4f0a101

(także w lekcji 3)

### Chain of Thoughts

> Zilustruj mi proszę <PATTERN> w <TECHNOLOGIA>, ale pomijając wszelkie nieistotne rzeczy typu zależności, zbędne i nadmierne komentarze itd. interesują mnie tylko absolutnie kluczowe linijki kodu, które ilustrują wzorzec.
> Chcę, abyś zaczął od opisu kluczowych założeń wzorca oraz problemów jakie ma na celu rozwiązać, a następnie przejść do kodu.
> Założenia wylistuj w osobnej sekcji

przykład: https://gemini.google.com/share/a4bb84fadfea

### Nie zatruwaj kontekstu

**zamiast**:
> Wyjaśnij mi na czym polega domena logistyczna / transportowa / magazynowa. Wskaż bounded contexty w rozumieniu DDD.
zapytaj o rzeczy ważne, bez zatruwania niepotrzebną terminologią/żargonem:
> Wyjaśnij mi na czym polega biznes logistyczny / transportowy / magazynowy. Wskaż klientów, sposoby zarabiania, główne usługi jakie są świadczone, zasoby, sposoby [...].

### Weryfikuj

> Jak działa / o co chodzi / na czym polega [...]?
> Każdy argument jaki poruszysz MUSISZ potwierdzić źródłem / linkiem.
> Twoją wypowiedź MUSI się dać szybko i wygodnie zweryfikować w źródłach.

# Lekcja 3 (Modelowanie Odpowiedzi)

### Unikaj pochlebstw

albo:
> Don’t be sycophantic.

### Zredukuj szum implementacyjny

> [...] Nie dołączaj zależności.
> Usuń komentarze.
> Uprość kod.
> Chcę widzieć tylko “CORE” problemu i ilustrację
> (wzorca / architektury / rozwiązania)
> Wszystko, co zbędne, usuń.

przykład: https://gemini.google.com/share/54a75c2456bb

### Pomiń wstęp:

> [...] Provide only the answer, no introduction

### Bez ściany tekstu

> [...] Avoid long walls of text. Use bullet points

### *-shot prompt

Zero-shot prompt - krótki prompt, ale bez przykładów - LLM sam sobie "dopowie" czego brakuje
One-shot prompt - prompt zawiera jeden przykład. Może to "usztywniać" odpowiedź, ale będzie przynajmniej zgodna z oczekiwaniami
Few-shot prompt - optymalne pod względem jakości, ale największy koszt przygotowania 🤷

### wide research in bullet-point style

przykład: https://claude.ai/share/668c8150-20cc-4cee-8534-bfc511ced0c8

### odpowiadaj "grubo"

> [...] Use PhD level thinking.
przykład: https://gemini.google.com/share/d8ad257c6a2f

### listening-friendly prompt

> Odpowiedź ma być wygodna do słuchania. Jeśli planujesz uwzględnić fragmenty kodu, diagramy, tabele itp. - to dodatkowo opisz je słownie.

### Flesch reading ease

> Opowiedz mi o zagadnieniu <ABC>.
> Flesch reading ease: 80.

przykład: https://claude.ai/share/80e4a832-5d0f-4414-94c4-312ea0bbf1d6

a take Gunning-Fog Index: https://gemini.google.com/share/b3ea6ab7de4b, https://gemini.google.com/share/86c5b436903b

### Reframing the problem

> Przeformułuj (omawiany w wątku problem) w taki sposób, aby zupełnie zmienić moje postrzeganie. Tak, jakbym się z omawianym problemem zetknął/ęła po raz pierwszy.

przykład: https://www.perplexity.ai/search/dj-public-wyjasnij-jak-dziala-9IhKd5T3RaSGHu_Enljm9Q#0

# Lekcja 4 (Wzorce Promptów)

### Enhance prompt
> Potrzebuję abyś uporządkował mój prompt. Zamierzam go użyć w innym narzędziu LLM. Poniższy prompt zawiera istotne informacje, ale jest nie ustrukturyzowany. Potencjalnie zawiera dużo powtórzeń. Jest nieuporządkowany, kolejność jest zaburzona. Chciałbym abyś go uporządkował, usunął powtórzenia i ewentualnie uzupełnił ważne aspekty, które w poniższym promptie jeszcze nie są uwzględnione.

### Context-dump prompt
> W powyższym wątku omówiliśmy bardzo dużo zagadnień. Chciał(a)bym, abyś teraz podsumował kluczowe rzeczy, których się nauczyłem/am, ustrukturyzował to w formie rozdziałów oraz bullet-pointów. Koncentruj się przede wszystkim na pytaniach, które zadawałem/am, i tym czego się nauczyłem/am.

### Different Perspectives prompt
> W jaki różny sposób osoby takie jak Developer, PM, DevOps, Architekt Mogą podchodzić do kwestii observability i monitoringu i, szeroko ujmując, automatyzacji infrastruktury w danej firmie?
> Na ile priorytety, cele, środki będą takie same, a na ile będą rozbieżne pomiędzy takimi osobami?
przykład: https://gemini.google.com/share/6d830cbe7020

### I might be wrong prompt
> Wydaje mi się, że coś tam… Mam argumenty takie, śmakie i owakie. Ale to jest tylko moje obecne rozumienie. Mogę się mylić. Chciałbym abyś wedle swojej najlepszej wiedzy i danych dostępnych w Internecie, zwłaszcza naukowych, zweryfikował moje twierdzenie i jeśli cokolwiek jest błędne lub nielogiczne, żebyś wypunktował wszystkie nieścisłości.
przykład: https://gemini.google.com/share/e2b4eebd2282

### Spec prompt
> Będę potrzebował(a) zbudować coś w innym narzędziu LLM i potrzebuję, abyś pomógł mi zbudować dokładnego prompta poprzez doprecyzowywanie ważnych zagadnień, o których nie pomyślałem. Ogólnie to chcę osiągnąć <ABC>. Zadawaj mi pytania naprowadzające, które doprecyzują zakres. W każdym wątku, w każdej odpowiedzi oczekuję, że zrzucisz dotychczasową specyfikację. Oraz zadasz doprecyzowujące pytania, ja na nie odpowiem i w twojej odpowiedzi znowu zrzucisz dotychczasową specyfikację, abym cały czas widział(a), jak obecna specyfikacja wygląda i jak ewoluuje.

### Constructive Criticism prompt
> Masz tu opis problemu i propozycję rozwiązania: [...]
> Co w nim jest nie tak? Czego mógłbyś się przyczepić? Na co nie zwróciłem/am uwagi?

### Confirm prompt
> (wcześniejszy wątek) [...]
> 
> Chcę się upewnić, czy dobrze rozumiem: [...]
> Odpowiedz krótko, najlepiej jednozdaniowo.
> PS Don't be sycophantic!

### Listening-friendly prompt
> Opowiedz mi o zagadnieniu <XYZ>. Twoja odpowiedź ma być wygodna w słuchaniu.
> 
> Jeśli planujesz uwzględniać kawałki kodu, tabele, diagramy itd. to śmiało - uwzględniaj je. Ale tuż pod nimi opisz słowami ich znaczenie. W szczególności opisz to, co w danym kawałku kodu, tabeli, diagramie itd. jest istotne. Pamiętaj: twoja odpowiedź ma być przyjemna w słuchaniu.

# Lekcja 5 (Speech To Text)

## STT Prompt

> This is a prompt that I would like you to enhance in a way that you make it more clear, more structurized, reorder if you think it makes the text easier to understand, remove potential repetition apply markdown format preferably.
> 
> If something is uncertain, please ask me explicitly.
> 
> Your output should be basically my enhanced prompt. And only when you've got some questions to answer then please write them all uppercase, screaming case, so that it would be easier for me  to identify it and answer you.

## ENHANCE & CLEAR - JAVA APP

superwhisper mode
enhance & clear
claude 4 sonnet

META (TTS) PROMPT:
> This is a prompt that I would like you to enhance in a way that you make it more clear, more structurized, reorder if you think it makes the text easier to understand, remove potential repetition apply markdown format preferably.
> 
> If something is uncertain, please ask me explicitly.
>
> Your output should be basically my enhanced prompt. And only when you've got some questions to answer then please write them all uppercase, screaming case, so that it would be easier for me to identify it and answer you.

My prompt:
> I wanted to create a Java application that would use Spring under the hood and Hibernate for data access. It needs to expose some rest endpoints that would access the data and maybe two or three collections, you know, standard operations on data.

Output:
```md
# Java Spring Boot Application with Hibernate - Enhanced Requirements

## **Project Overview**
Create a Java application using:
- **Framework**: Spring Boot
- **Data Access**: Hibernate ORM
- **API Type**: REST endpoints
- **Operations**: Standard CRUD operations

## **Technical Stack**
- **Backend**: Java + Spring Boot
- **ORM**: Hibernate
- **API**: RESTful web services
- **Database Operations**: Create, Read, Update, Delete

## **Functional Requirements**
- Expose REST endpoints for data access
- Implement standard data operations (CRUD)
- Handle 2-3 data collections/entities

## **Questions for Clarification**

**WHAT DATABASE SYSTEM WOULD YOU LIKE TO USE (E.G., MYSQL, POSTGRESQL, H2)?**

**WHAT ARE THE 2-3 DATA ENTITIES/COLLECTIONS YOU WANT TO MANAGE?**

**DO YOU NEED ANY SPECIFIC AUTHENTICATION/AUTHORIZATION?**

**WHAT BUILD TOOL DO YOU PREFER (MAVEN OR GRADLE)?**

**DO YOU NEED ANY SPECIFIC VALIDATION OR ERROR HANDLING REQUIREMENTS?**
```

## ENHANCE & CLEAR - BROWSER EXTENSION

superwhisper mode
enhance & clear
claude 4 sonnet

My Prompt:
> I want you to help me to generate a Chrome browser extension, which when opened, allows me to define the sites per domain that I want to block, sites or domains, maybe with some, you know, using asterisk as a wild card. And I can turn it on or turn it off. Also, besides that, for all browser tabs that are active, it would calculate with the granularity of seconds, how long do I spend on these sites? So if I walk away from a tab or it's, you know, on a screen that I'm not using, et cetera, it would not be calculated. But I want to track basically how much time do I spend on certain pages so that I can basically, you know, verify my habits. So it's a productivity application. So please provide quite a simple UI for this. And what I care is that you would create all the files with all the content for me please.

A:
```md
# Chrome Extension Development Request

## Project Overview
You want me to create a **productivity-focused Chrome browser extension** that combines website blocking and time tracking functionality.

## Core Features

### 1. Website Blocking
- **Domain Management**: Define sites/domains to block
- **Wildcard Support**: Use asterisk (*) as wildcards for flexible blocking patterns
- **Toggle Control**: Enable/disable blocking functionality

### 2. Time Tracking
- **Active Tab Monitoring**: Track time spent only on active, visible tabs
- **Granular Precision**: Calculate time with second-level accuracy
- **Habit Analysis**: Monitor browsing patterns for productivity insights
- **Inactive Detection**: Exclude time when tabs are inactive or not in focus

### 3. User Interface
- **Simple Design**: Clean, intuitive interface
- **Easy Configuration**: Straightforward setup for blocked sites
- **Time Reports**: Display tracked browsing time data

## Deliverables
- Complete Chrome extension with all necessary files
- Full source code for immediate deployment
- Manifest file and required permissions
- Background scripts for functionality
- Popup UI for user interaction

## Questions for Clarification

**HOW WOULD YOU LIKE THE TIME TRACKING DATA TO BE DISPLAYED? (e.g., daily summaries, weekly reports, real-time counters)**

**DO YOU WANT THE EXTENSION TO STORE DATA LOCALLY OR SYNC ACROSS DEVICES?**

**SHOULD BLOCKED SITES SHOW A CUSTOM BLOCK PAGE OR JUST PREVENT NAVIGATION?**

**WHAT TIME FORMAT DO YOU PREFER FOR DISPLAYING TRACKED TIME? (e.g., hours:minutes:seconds, total minutes)**
```
