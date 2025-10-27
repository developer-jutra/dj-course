# Jak pracować z Jupyter

TL;DR;

```shell
# stwórz virtualenv
python -m venv .venv

# aktywuj virtualenv (linux/macos)
source .venv/bin/activate
# aktywuj virtualenv (windows)
.venv\Scripts\Activate.ps1

# uruchom serwer i otwórz URL np. localhost:8888
jupyter notebook

# wyjdź/wyłącz (opcjonalnie) virtualenv
deactivate
```

Opcji jest kilka, m.in.

- jupyter lokalnie
  - z tzw. jądrem instalowanym **globanie** (per user/maszyna)
  - lub w **lokalnym virtualenv** (pythonowy standard - takie niby "środowisko per folder/projekt")
- **google colab** - usługa cloudowa z jupyterem z dużym free tier

## building blocks - w skrócie:

- jądro (jupyter kernel) - pozwala uruchamiać/hostować notatniki
  - towrzysz je tylko raz :)
  - może być globalne lub per virtual-env
- jupyter notebook - pojedynczy notatnik (plik `ipynb` - _Interactive PYthon NoteBook_)

## podstawowe komendy zarządzania kernelami `jupyter`

po co? separacja środowisk (w pewnym momencie jest przydatna ;) )

- listuj jądra: `jupyter kernelspec list`
- stwórz jupyter kernel: `python -m ipykernel install --user --name=dj_projekt --display-name="DJ SAJENS"`
- usuń jupyter kernel: `jupyter kernelspec uninstall dj_projekt`
