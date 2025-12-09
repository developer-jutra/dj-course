from google import genai
from google.genai import types
import os 
from colorama import Fore, Style

from dotenv import load_dotenv
load_dotenv()

print(f"env var \"GEMINI_API_KEY\" is: { os.getenv('GEMINI_API_KEY', '')[:4] + '...' + os.getenv('GEMINI_API_KEY', '')[-4:] if len(os.getenv('GEMINI_API_KEY', '')) > 0 else 'NOT SET' }")
if not os.getenv('GEMINI_API_KEY'):
    raise ValueError("GEMINI_API_KEY environment variable is not set. Please set it to your Google Gemini API key.")

client = genai.Client()

model = "gemini-2.5-flash"

COMMON_CHARACTERISTICS = "Wypowiadasz się tylko za siebie. Odpowiedź jest tekstem a nie markdownem. Unikasz mówienia kim jesteś bo to oczywiste. Nie powtarzasz tego, co już zostało powiedziane."

TECHNICAL_ROLE = f"Jesteś doświadczonym tech leadem który zna się na programowaniu, bazach danych i chcesz pomóc. Masz też tendencję do szukania błędów w logicznym rozumowaniu innych lub drążeniu nieścisłości. Starasz się mówić zwięźle. {COMMON_CHARACTERISTICS}. W dialogu jesteś ty i CTO firmy."

CTO_ROLE = f"Jesteś doświadczonym CTO który zna się na zarządzaniu zespołami developerskimi, architekturze systemów i strategii technologicznej. Jesteś zdenerwowany, ale starasz się odpowiadać zwięźle i konkretnie. Zależy Ci na rozwiązaniu problemów szybko, bo to ty za sytuację odpowiadasz. {COMMON_CHARACTERISTICS}. W dialogu jesteś ty i Tech Lead zespołu deweloperskiego."

INITIAL_PROMPT = "Mamy awarię na produkcji związaną z niedostępnością usług bazodanowych. Trzeba natychmiast zająć się problemem..."

print(f"{Fore.CYAN}INITIAL_PROMPT{Style.RESET_ALL}: {INITIAL_PROMPT}\n")

conversation_history = []

def ask_model(system_role, conversation_history):
    response = client.models.generate_content(
        model=model,
        contents=conversation_history,
        config=types.GenerateContentConfig(
            system_instruction=system_role,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
            max_output_tokens=196
        ),
    )
    return response

turn1_history = [
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=INITIAL_PROMPT)]
    ),
]

turn1 = ask_model(TECHNICAL_ROLE, turn1_history)
print(f"{Fore.GREEN}TECHNICAL_ROLE{Style.RESET_ALL}: {turn1.text}\n")
turn1_answer = turn1.text

# PRZYKŁADOWA ODPOWIEDŹ 
# 
# turn1_answer = """
# Okej, rozumiem. Awaria na produkcji z niedostępnością usług bazodanowych to bardzo poważna sprawa. Musimy działać szybko i metodycznie.
# Zanim zaczniemy cokolwiek robić, musimy zebrać trochę informacji. Skoro jestem "tech leadem", to muszę zrozumieć, co się dzieje, żeby nie działać po omacku.
# Moje pierwsze pytanie jest proste, ale kluczowe:
# "Niedostępność usług bazodanowych" – czy to oznacza, że aplikacje nie mogą połączyć się z bazą danych, czy może baza
# """

turn2_history = [
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=INITIAL_PROMPT)]
    ),
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=turn1_answer)]
    ),
]

turn2 = ask_model(CTO_ROLE, turn2_history)
print(f"{Fore.YELLOW}CTO{Style.RESET_ALL}: {turn2.text}\n")
turn2_answer = turn2.text

# PRZYKŁADOWA ODPOWIEDŹ
# 
# turn2_answer = """
# Niedostępność? To fatalnie. Czas ucieka.
# Szybko: czy aplikacje nie mogą połączyć się z bazą, czy baza danych jest wyłączona/niedostępna w sensie instancji? Potrzebuję konkretów.
# """

turn3_history = [
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=INITIAL_PROMPT)]
    ),
    types.Content(
        role="model",
        parts=[types.Part.from_text(text=turn1_answer)]
    ),
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=turn2_answer)]
    ),
]

turn3 = ask_model(TECHNICAL_ROLE, turn3_history)
print(f"{Fore.GREEN}TECHNICAL_ROLE{Style.RESET_ALL}: {turn3.text}")
turn3_answer = turn3.text

# PRZYKŁADOWA ODPOWIEDŹ
# 
# turn3_answer = """
# Rozumiem presję czasu. Musimy działać precyzyjnie.
# 
# Pytanie jest konkretne i oczekuję konkretnej odpowiedzi, by nie tracić czasu na błędne założenia:
# 
# Czy mamy problem z warstwą sieciową/połączeniową do bazy danych (aplikacje nie mogą się połączyć), czy z samym stanem instancji bazy danych (instancja jest zatrzymana/niedostępna)?
# """


turn4_history = [
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=INITIAL_PROMPT)]
    ),
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=turn1_answer)]
    ),
    types.Content(
        role="model",
        parts=[types.Part.from_text(text=turn2_answer)]
    ),
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=turn3_answer)]
    ),
]

turn4 = ask_model(CTO_ROLE, turn4_history)
print(f"{Fore.YELLOW}CTO{Style.RESET_ALL}: {turn4.text}")
turn4_answer = turn4.text

# PRZYKŁADOWA ODPOWIEDŹ
# 
# turn4_answer = """
# Aplikacje nie mogą się połączyć. Ping na adres IP bazy danych działa. Serwer jest dostępny.
# """

turn5_history = [
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=INITIAL_PROMPT)]
    ),
    types.Content(
        role="model",
        parts=[types.Part.from_text(text=turn1_answer)]
    ),
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=turn2_answer)]
    ),
    types.Content(
        role="model",
        parts=[types.Part.from_text(text=turn3_answer)]
    ),
    types.Content(
        role="user",
        parts=[types.Part.from_text(text=turn4_answer)]
    ),
]

turn5 = ask_model(TECHNICAL_ROLE, turn5_history)
print(f"{Fore.GREEN}TECHNICAL_ROLE{Style.RESET_ALL}: {turn5.text}")
turn5_answer = turn5.text

# PRZYKŁADOWA ODPOWIEDŹ
# 
# turn5_answer = """
# Okej, więc serwer bazy danych jest osiągalny sieciowo, ale aplikacje nie mogą nawiązać połączenia. To zawęża zakres problemu.
# Pytanie kontrolne:
# Czy próbowaliście połączyć się z bazą danych z serwera aplikacji za pomocą jakiegoś prostego klienta (np. psql, sqlcmd, mysql client), pomijając samą aplikację? Chodzi o sprawdzenie, czy problem leży w konfiguracji aplikacji, czy faktycznie w warstwie samej bazy danych.
# """

# turn6_history = [
#     types.Content(
#         role="user",
#         parts=[types.Part.from_text(text=INITIAL_PROMPT)]
#     ),
#     types.Content(
#         role="user",
#         parts=[types.Part.from_text(text=turn1_answer)]
#     ),
#     types.Content(
#         role="model",
#         parts=[types.Part.from_text(text=turn2_answer)]
#     ),
#     types.Content(
#         role="user",
#         parts=[types.Part.from_text(text=turn3_answer)]
#     ),
#     types.Content(
#         role="user",
#         parts=[types.Part.from_text(text=turn4_answer)]
#     ),
#     types.Content(
#         role="model",
#         parts=[types.Part.from_text(text=turn5_answer)]
#     ),
# ]

# turn6 = ask_model(TECHNICAL_ROLE, turn6_history)
# print(f"{Fore.YELLOW}CTO{Style.RESET_ALL}: {turn6.text}")
# turn6_answer = turn6.text

