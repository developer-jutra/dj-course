# Jak uruchamiać/instalować pod-projekty node.js?

1. zależności można instalować globalnie (niezalecane)
2. albo lokalnie (zalecane) - i tu jest sporo opcji typu `npm`, `yarn`, `pnpm` i miliardy innych. Dla uproszczenia - trzymam się po prostu `npm`.

Należy wejść w każdy folder pod-projektowy. Rozpoznasz go (jednocześnie):
- **technicznie** - zawiera plik `package.json` - który ma listę zależności
- **konwencja** w DJ - jest podfolderem modułu DJ, np. `M1/szczypta-machine-learning`
  - Innymi słowy, **NIE MA** sytuacji typu: `M1/cośtam/projekt`

TL;DR; Komendy:

instalowanie zależności:

```shell
npm install
```

ewentualnie - najpierw usuń istniejące a potem instaluj od zera (mac/linux):

```shell
rm -rf node_modules
npm install
```

lub windows:

```powershell
Remove-Item -Path node_modules -Recurse -Force
npm install
```

cmd:

```cmd
RD /S /Q node_modules
npm install
```
