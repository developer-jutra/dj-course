## Sprawdź zużycie u dostawców:

- anthropic: https://console.anthropic.com/usage
- cursor: https://cursor.com/dashboard?tab=usage
- copilot: https://github.com/settings/billing/usage
- openAI: https://platform.openai.com/usage
- google: https://aistudio.google.com/app/usage
- openrouter: https://openrouter.ai/settings/keys
- huggingface: https://huggingface.co/settings/tokens

## Ile ważą lokalne modele:

Śledź ile zajmują lokalne modele

```bash
du -sh ~/.cache/huggingface
 9.4G    /Users/<USER>/.cache/huggingface
# (automatycznie ściągane np. przy okazji używania przez bibliotekę `transformers`)

du -sh ~/Library/Caches/llama.cpp/
 27G    /Users/<USER>/Library/Caches/llama.cpp/

du -sh ~/.ollama
 43G    /Users/<USER>/.ollama
```

sprawdź lokalny rozmiar wszystkiego wewnątrz `~`: `find ~ -maxdepth 1 -mindepth 1 -print0 | xargs -0 du -sh`
