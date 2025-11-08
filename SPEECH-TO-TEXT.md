# Speech-To-Text

## [SuperWhisper](https://superwhisper.com/)

- nie pisz wszystkiego ręcznie :) dyktuj!
  - na poziomie UI systemu operacyjnego wybierasz np. edytor tekstu, skrót klawiszowy -> nagrywasz, dyktujesz -> znowu skrót klawiszowy -> masz tekst w edytorze
  - model nieźle łapie interpunkcję
  - zawahania i zwieszki (podczas naturalnego ludzkiego mówienia) są automatycznie "wyprostowywane", +-korekta w locie
  - dyktowanie przez superwhisper np. do perplexity działa _lepiej_ niż natywny "dyktafon" perplexity
- free/PRO
  - free: model anglojęzyczny, bardzo good-enough
  - lepsiejsze modele płatne, w tym nie-anglojęzyczne
  - 15 minut PRO darmowo na zachętę
- mac - stable, windows - early/beta
- integracja z LLMami (!)
  - w ramach PRO
  - działanie:
    - dyktujesz
    - tekst przepuszczany do LLMa
    - (możesz dodać custom prompty, cuda wianki)
    - to co trafia do edytora jest odpowiedzią z LLMa
- [TUTORIAL: superwhisper](https://www.youtube.com/watch?v=h_A3bOtyihk)

![SuperWhisper](./.img/superwhisper.png)

## [WhisperTyping](https://whispertyping.com/)

## native windows

- hotkey: [logo Windows + H](https://support.microsoft.com/pl-pl/windows/mowa-aktywacja-g%C5%82osowa-pismo-odr%C4%99czne-wpisywanie-i-prywatno%C5%9B%C4%87-149e0e60-7c93-dedd-a0d8-5731b71a4fef#:~:text=Otw%C3%B3rz%20wpisywanie%20g%C5%82osowe%2C%20naciskaj%C4%85c%20klawisz%20z%20logo,Dowiedz%20si%C4%99%2C%20jak%20przesta%C4%87%20udost%C4%99pnia%C4%87%20klipy%20g%C5%82osowe)

## custom solution

- praca domowa w M2
  - oparta o modele z rodziny: [openai/whisper](https://huggingface.co/collections/openai/whisper-release)
