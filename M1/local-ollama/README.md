# `ollama`

## install

https://ollama.com/download :)

## run

Uruchom `ollama` aby zobaczyć dostępne komendy.
Tworzenie "modelu" (opakowk): `ollama create MODEL [flags]` (help: `ollama help create`)
np. `ollama create poeta -f ./poeta/Modelfile`

przykład (uruchomienie i opcjonalne dociągnięcie modelu):
`ollama run hf.co/speakleash/Bielik-4.5B-v3.0-Instruct`

tworzenie "custom modelu":
`ollama create poeta -f ./poeta/Modelfile`

## mini-jailbreak

w folderze `deepseek-niewygodne-pytania` znajduje się zapisany stan konwersacji ()`/save <NAME>`)