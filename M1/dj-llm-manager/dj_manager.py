import os
import sys
import subprocess
import time
import re
from typing import List, Optional
from dotenv import load_dotenv
from colorama import Fore, Style, init
from pydantic import BaseModel, ValidationError
import pandas as pd

init(autoreset=True)

# --- STAŁE ---
MIN_MODEL_SIZE_BYTES = 10 * 1024 * 1024 # 10 MB

# Kolory zgodnie z życzeniem
DIAGNOSTICS_COLOR = Fore.CYAN
SIZE_COLOR = Fore.MAGENTA
HEADER_COLOR = Fore.GREEN

TARGET_DIRS = {
    "OLLAMA_DIR": {"label": "Ollama Data", "default": "~/.ollama"},
    "LLAMA_CPP_DIR": {"label": "Llama.cpp Cache", "default": "~/Library/Caches/llama.cpp"},
    "HUGGINGFACE_CACHE_DIR": {"label": "Hugging Face Cache", "default": "~/.cache/huggingface"},
}

# --- MODELE PYDANTIC ---
class LocalModel(BaseModel):
    """Ujednolicony model dla lokalnie przechowywanych modeli LLM."""
    size_bytes: int
    model_name: str
    platform: str
    size_hr: str # Human readable size

class DiskSummary(BaseModel):
    """Model dla pojedynczego wpisu w podsumowaniu zajętości miejsca na dysku."""
    label: str
    size_bytes: int
    size_hr: str
    path: str
    exists: bool

# --- FUNKCJE UTILITY ---

def bytes_to_human_readable(size_bytes):
    # Działanie funkcji bez zmian
    if size_bytes == 0:
        return "0B"
    
    units = ["B", "K", "M", "G", "T"]
    
    i = 0
    while size_bytes >= 1024 and i < len(units) - 1:
        size_bytes /= 1024
        i += 1
    
    return f"{size_bytes:.1f}{units[i]}"

def human_readable_to_bytes(size_hr: str) -> Optional[int]:
    # Działanie funkcji bez zmian
    size_hr = size_hr.strip().upper().replace(',', '.')
    
    if not size_hr:
        return None
        
    match = re.match(r"([\d\.]+)\s*(GB|MB|KB|B)", size_hr)
    if not match:
        match = re.match(r"([\d\.]+)(GB|MB|KB|B)", size_hr)
        if not match:
            return None
            
    value_str, unit = match.groups()
    
    multiplier = 1
    if unit == 'GB':
        multiplier = 1024 ** 3
    elif unit == 'MB':
        multiplier = 1024 ** 2
    elif unit == 'KB':
        multiplier = 1024 ** 1
    
    try:
        value = float(value_str)
        return int(value * multiplier)
    except ValueError:
        return None


def get_directory_size(path):
    # Działanie funkcji bez zmian
    total_size = 0
    try:
        for dirpath, dirnames, filenames in os.walk(path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                if not os.path.islink(fp):
                    total_size += os.path.getsize(fp)
    except FileNotFoundError:
        return None
    except Exception:
        return None
        
    return total_size

def resolve_path(path):
    # Działanie funkcji bez zmian
    return os.path.abspath(os.path.expanduser(path))


def get_paths_to_check():
    # Działanie funkcji bez zmian
    paths_to_check = []
    for env_var, data in TARGET_DIRS.items():
        path = os.getenv(env_var, data['default'])
        resolved_path = resolve_path(path)
        
        if not path or not resolved_path:
            continue
            
        exists = os.path.isdir(resolved_path)
        
        paths_to_check.append({
            "label": data['label'],
            "env_var": env_var,
            "resolved_path": resolved_path,
            "exists": exists
        })
    return paths_to_check


def execute_diagnostics(paths_to_check):
    """Wyświetla zunifikowaną sekcję diagnostyczną."""
    print(f"\n{DIAGNOSTICS_COLOR}diagnostics > Użyte ścieżki (z .env):{Style.RESET_ALL}")
    for item in paths_to_check:
        status = f"{Fore.GREEN}OK{Style.RESET_ALL}" if item['exists'] else f"{Fore.YELLOW}Nie istnieje{Style.RESET_ALL}"
        print(f"{DIAGNOSTICS_COLOR}diagnostics >{Style.RESET_ALL} {item['label']} ({item['env_var']}): {item['resolved_path']} [{status}]")


# --- FUNKCJE ZBIERAJĄCE DANE DO MODELU ---

def collect_ollama_models() -> List[LocalModel]:
    # Działanie funkcji bez zmian
    models = []
    try:
        result = subprocess.run(['ollama', 'list'], capture_output=True, text=True, check=True)
        lines = result.stdout.strip().split('\n')[1:]

        for line in lines:
            parts = re.split(r'\s{2,}', line.strip()) 
            
            if len(parts) >= 3:
                model_name = parts[0].strip()
                size_hr = parts[2].strip()
                
                size_bytes = human_readable_to_bytes(size_hr)
                
                if size_bytes is not None and size_bytes > MIN_MODEL_SIZE_BYTES:
                    try:
                        models.append(LocalModel(
                            size_bytes=size_bytes,
                            model_name=model_name,
                            platform='ollama',
                            size_hr=size_hr
                        ))
                    except ValidationError as e:
                        print(f"{Fore.RED}Błąd walidacji Pydantic dla modelu Ollama '{model_name}': {e}{Style.RESET_ALL}")
                        print(f"{Fore.RED}Dane wejściowe: size_bytes={size_bytes}, size_hr='{size_hr}'{Style.RESET_ALL}")
                
    except FileNotFoundError:
        print(f"{Fore.RED}Błąd: Komenda 'ollama' nie została znaleziona lub nie można jej uruchomić.{Style.RESET_ALL}")
    except Exception as e:
        print(f"{Fore.RED}Ogólny błąd podczas zbierania modeli Ollama: {e}{Style.RESET_ALL}")
        
    return models

def collect_llama_cpp_models(llm_dir) -> List[LocalModel]:
    # Działanie funkcji bez zmian
    models = []
    
    if not os.path.isdir(llm_dir):
        return models

    try:
        for entry in os.scandir(llm_dir):
            if entry.is_file() and entry.stat().st_size > MIN_MODEL_SIZE_BYTES:
                size_bytes = entry.stat().st_size
                
                model_name = entry.name
                if model_name.endswith(('.gguf', '.etag')):
                    model_name = os.path.splitext(model_name)[0]
                
                if model_name.endswith(('.gguf', '.etag')):
                    model_name = os.path.splitext(model_name)[0]
                
                models.append(LocalModel(
                    size_bytes=size_bytes,
                    model_name=model_name,
                    platform='llama-cpp',
                    size_hr=bytes_to_human_readable(size_bytes)
                ))

    except Exception:
        pass
        
    return models


def collect_huggingface_models(hf_dir) -> List[LocalModel]:
    # Działanie funkcji bez zmian
    models = []
    hub_dir = os.path.join(hf_dir, 'hub')
    
    if not os.path.isdir(hub_dir):
        return models
    
    try:
        for entry in os.scandir(hub_dir):
            if entry.is_dir():
                path = entry.path
                size_bytes = get_directory_size(path)

                if size_bytes is not None and size_bytes > MIN_MODEL_SIZE_BYTES:
                    name = entry.name.replace('models--', '')
                    
                    models.append(LocalModel(
                        size_bytes=size_bytes,
                        model_name=name,
                        platform='huggingface',
                        size_hr=bytes_to_human_readable(size_bytes)
                    ))
    
    except Exception:
        pass
        
    return models

# --- FUNKCJE GŁÓWNE ---

def generate_dataframe(paths_to_check):
    
    start_time = time.time()
    all_models: List[LocalModel] = []
    
    # paths_to_check jest przekazywane
    
    ollama_path = next((item['resolved_path'] for item in paths_to_check if item['env_var'] == 'OLLAMA_DIR' and item['exists']), None)
    llama_cpp_path = next((item['resolved_path'] for item in paths_to_check if item['env_var'] == 'LLAMA_CPP_DIR' and item['exists']), None)
    hf_cache_path = next((item['resolved_path'] for item in paths_to_check if item['env_var'] == 'HUGGINGFACE_CACHE_DIR' and item['exists']), None)

    # Zbieranie danych (diagnostics format)
    print(f"\n{DIAGNOSTICS_COLOR}diagnostics >{Style.RESET_ALL} Zbieranie danych o modelach (może chwilę potrwać)...") 
    
    if ollama_path:
        all_models.extend(collect_ollama_models())
    
    if llama_cpp_path:
        all_models.extend(collect_llama_cpp_models(llama_cpp_path))
        
    if hf_cache_path:
        all_models.extend(collect_huggingface_models(hf_cache_path))
        
    end_time = time.time()
    duration = end_time - start_time
    
    # Zakończone (diagnostics format)
    print(f"{DIAGNOSTICS_COLOR}diagnostics > Zakończone: {duration:.2f}s{Style.RESET_ALL}")

    if not all_models:
        print(f"{Fore.YELLOW}Nie znaleziono żadnych modeli większych niż {bytes_to_human_readable(MIN_MODEL_SIZE_BYTES)}.{Style.RESET_ALL}")
        return

    # Tworzenie i sortowanie Data Frame
    df = pd.DataFrame([model.model_dump() for model in all_models])
    df_sorted = df.sort_values(by='size_bytes', ascending=False)
    
    df_display = df_sorted[['platform', 'size_hr', 'model_name']].copy()
    df_display.columns = ['Platforma', 'Rozmiar', 'Nazwa Modelu']

    # Ustalenie szerokości kolumn dla lepszego formatowania w konsoli
    PLATFORM_WIDTH = 12
    SIZE_WIDTH = 10
    
    # Ręczne wyświetlanie nagłówka (Zielony)
    print(f"\n{HEADER_COLOR}{df_display.columns[0]:<{PLATFORM_WIDTH}}{df_display.columns[1]:<{SIZE_WIDTH}}{df_display.columns[2]:<}{Style.RESET_ALL}")
    
    # Wyświetlanie danych z kolorowaniem Rozmiaru (Magenta)
    output_lines = []
    for _, row in df_display.iterrows():
        line = (
            f"{row['Platforma']:<{PLATFORM_WIDTH}}"
            f"{SIZE_COLOR}{row['Rozmiar']:<{SIZE_WIDTH}}{Style.RESET_ALL}"
            f"{row['Nazwa Modelu']}"
        )
        output_lines.append(line)
        
    print('\n'.join(output_lines))


def execute_disk_summary(paths_to_check):
    """Zbiera i wyświetla posortowane podsumowanie zajętości miejsca na dysku."""
    
    disk_summary_data: List[DiskSummary] = []
    total_disk_usage = 0
    
    # 1. Zbieranie danych do sortowania
    for item in paths_to_check:
        
        size = get_directory_size(item['resolved_path'])
        
        if size is not None and item['exists']:
            human_size = bytes_to_human_readable(size)
            disk_summary_data.append(DiskSummary(
                label=item['label'],
                size_bytes=size,
                size_hr=human_size,
                path=item['resolved_path'],
                exists=True
            ))
            total_disk_usage += size
        else:
            # Obsługa ścieżek, które nie istnieją lub wystąpił błąd
            error_message = ""
            if not item['exists']:
                 error_message = f"{Fore.YELLOW}Ścieżka nie istnieje: {item['resolved_path']}{Style.RESET_ALL}"
            elif size is None:
                error_message = f"{Fore.RED}Błąd podczas obliczania rozmiaru lub brak uprawnień.{Style.RESET_ALL}"
                
            disk_summary_data.append(DiskSummary(
                label=item['label'],
                size_bytes=0,
                size_hr=error_message,
                path=item['resolved_path'],
                exists=False
            ))


    # 2. Sortowanie malejąco
    existing_paths = [d for d in disk_summary_data if d.exists]
    error_paths = [d for d in disk_summary_data if not d.exists]
    
    sorted_summary = sorted(existing_paths, key=lambda x: x.size_bytes, reverse=True)
    sorted_summary.extend(error_paths) # Dodajemy ścieżki z błędem na końcu
    
    # 3. Wyświetlanie posortowanego podsumowania
    print(f"\n{Fore.CYAN}--- ✨ DJ Manager: Podsumowanie Użycia Miejsca ✨ ---{Style.RESET_ALL}")
    
    for summary in sorted_summary:
        print(f"{summary.label}:")
        if summary.exists:
            print(f"  {SIZE_COLOR}{summary.size_hr:<8} {Style.RESET_ALL}{summary.path}")
        else:
            print(f"  {summary.size_hr}") 

    if total_disk_usage > 0:
        total_human_size = bytes_to_human_readable(total_disk_usage)
        print(f"\n{Fore.CYAN}Łącznie zajęte miejsce: {SIZE_COLOR}{Style.BRIGHT}{total_human_size}{Style.RESET_ALL}")

# Funkcja scalająca logiczną całość, teraz jako główny punkt wywołania
def execute_report():
    
    paths_to_check = get_paths_to_check()
    
    # 1. Diagnostyka
    execute_diagnostics(paths_to_check)

    # 2. Data Frame modeli (i towarzyszące mu logi)
    generate_dataframe(paths_to_check)
    
    # 3. Posortowane podsumowanie zajętości dysku
    execute_disk_summary(paths_to_check)


def display_help():
    paths_to_check = get_paths_to_check()
    execute_diagnostics(paths_to_check)
    
    print(f"\n{Fore.CYAN}--- ✨ DJ Manager: Pomoc ✨ ---{Style.RESET_ALL}")
    print(f"{Fore.GREEN}Dostępne Komendy:{Style.RESET_ALL}")
    print(f"  {Fore.YELLOW}disk-usage{Style.RESET_ALL}: Generuje pełny raport w kolejności: Diagnostyka -> Data Frame Modeli -> Podsumowanie Użycia Dysku (posortowane).")
    print(f"  {Fore.YELLOW}list-models{Style.RESET_ALL}: Wyświetla tylko sekcję Diagnostyki i ujednoliconą tabelę modeli (Data Frame).")
    print(f"  {Fore.YELLOW}help{Style.RESET_ALL}: Wyświetla ten ekran pomocy.")

def main():
    
    # Sprawdzenie pliku .env i załadowanie
    if not os.path.exists(".env"):
        print(f"{DIAGNOSTICS_COLOR}diagnostics >{Style.RESET_ALL} {Fore.YELLOW}Plik '.env' nie został znaleziony. Zostaną użyte wartości domyślne. Możesz utworzyć plik '.env' na podstawie '.env.example'.{Style.RESET_ALL}")
    
    load_dotenv() 

    command = "disk-usage"
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

    if command == "disk-usage":
        execute_report() # Nowa główna funkcja raportująca
    elif command == "list-models":
        paths_to_check = get_paths_to_check()
        execute_diagnostics(paths_to_check)
        generate_dataframe(paths_to_check)
    elif command == "help":
        display_help()
    else:
        paths_to_check = get_paths_to_check()
        execute_diagnostics(paths_to_check)
        print(f"{Fore.RED}\nNieznana komenda: {command}{Style.RESET_ALL}")
        display_help()

if __name__ == "__main__":
    main()
