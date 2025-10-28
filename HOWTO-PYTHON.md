# Jak uruchamiać/instalować pod-projekty pythonowe?

1. zależności można instalować globalnie (niezalecane)
2. albo lokalnie (zalecane) - i tu jest sporo opcji typu `venv`/`virtualenv`, `uv` itp. Z uwagi na popularność trzymam się `venv` - ale swobodnie - działajcie z tym co lubicie.

Należy wejść w każdy folder pod-projektowy. Rozpoznasz go (jednocześnie):
- **technicznie** - zawiera plik `requirements.txt` - który ma listę zależności
- **konwencja** w DJ - jest podfolderem modułu DJ, np. `M1/szczypta-machine-learning`
  - Innymi słowy, **NIE MA** sytuacji typu: `M1/cośtam/projekt`

TL;DR; Komendy:

```shell
# stwórz virtualenv
python -m venv .venv

# aktywuj virtualenv (linux/macos)
source .venv/bin/activate
# aktywuj virtualenv (windows)
.venv\Scripts\Activate.ps1

# wyjdź/wyłącz (opcjonalnie) virtualenv
deactivate
```

## `bash`/`zsh` alias (mac, linux)

Taki oto kodzik wrzuć do `~/.bashrc`, `~/.zshrc` czy czegokolwiek używasz.

```bash
alias prepenv='
    if [ -d ".venv" ]; then
        rm -rf .venv
    fi
    python -m venv .venv
    source .venv/bin/activate
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
    fi
'
```

## Windows (wymaga powershell)

```powershell
function prepenv {
    # 1. Sprawdzenie i usunięcie katalogu .venv (jeśli istnieje)
    if (Test-Path -Path ".venv" -PathType Container) {
        Remove-Item -Path ".venv" -Recurse -Force
    }

    # 2. Utworzenie środowiska wirtualnego
    python -m venv .venv

    # 3. Aktywacja środowiska wirtualnego (inna ścieżka i metoda na Windows)
    .venv\Scripts\Activate.ps1

    # 4. Instalacja zależności, jeśli requirements.txt istnieje
    if (Test-Path -Path "requirements.txt" -PathType Leaf) {
        pip install -r requirements.txt
    }
}
```
