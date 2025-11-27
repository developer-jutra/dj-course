// Przykład użycia go-prompt do definicji sugestii
package main

import (
    "github.com/c-bata/go-prompt"
)

// Funkcja zwracająca dostępne sugestie
func completer(d prompt.Document) []prompt.Suggest {
    // Sprawdza, co użytkownik wpisał do tej pory
    line := d.TextBeforeCursor() 
    
    // Proste sugestie dla komend pierwszego poziomu
    if len(line) == 0 || line[0] != '/' {
        return []prompt.Suggest{
            {Text: "/session", Description: "Zarządzanie sesjami"},
            {Text: "/settings", Description: "Konfiguracja"},
            {Text: "/help", Description: "Wyświetla pomoc"},
        }
    }
    
    // Zaawansowana logika dla komend drugiego poziomu
    if line == "/session " { // Jeśli użytkownik wpisał /session i spację
        return []prompt.Suggest{
            {Text: "list", Description: "Wyświetla listę sesji"},
            {Text: "display", Description: "Wyświetla szczegóły sesji"},
        }
    }
    
    // W bardziej rozbudowanym przykładzie, trzeba użyć wyrażeń regularnych
    // lub parsowania, aby dynamicznie ustalać kontekst komendy.
    return []prompt.Suggest{}
}

func main() {
    p := prompt.New(
        // Funkcja do wykonania po zatwierdzeniu linii
        func(t string){ 
            /* Logika obsługi komendy */ 
        },
        // Funkcja dostarczająca sugestie
        completer, 
    )
    p.Run()
}