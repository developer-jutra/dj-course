# mini-archiwum jak powstał szkielet chatdoga

## wątek google gemini

Możesz zobaczyć calutki wątek w którym powstawał Azor: https://gemini.google.com/share/e1705c608403

W pewnym momencie, siłą rzeczy ;), nastąpiła przesiadka na lokalne środowisko.

## inicjalny prompt 

i want you to remake my script (which works correctly, but is hardcoded) in a way that there's a LOOP where the python script asks the user for the input via `input()` function - and then calls the model. Afterwards, the response is being attached to the history conversation which started empty, obviously) and asks the user for another input via `input()`. The entire conversation is being kept in memory, also, when the program is being killed, the conversation is being saved into a <SESSION-ID>-log.json file. When conversation is being opened, SESSION_ID is being assigned and displayed. The log file is being constantly updated as conversation carries on.

Also, when we pass additional cli param (e.g. python chat.py --session-id=<SESSION-ID>) then the conversation is loaded into the memory and is being continued
