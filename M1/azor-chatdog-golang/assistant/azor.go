package assistant

// CreateAzorAssistant creates and returns an Azor assistant instance with default configuration.
func CreateAzorAssistant() *Assistant {
	assistantName := "AZOR"
	systemRole := "Jesteś pomocnym asystentem, Nazywasz się Azor i jesteś psem o wielkich możliwościach. Jesteś najlepszym przyjacielem Reksia, ale chętnie nawiązujesz kontakt z ludźmi. Twoim zadaniem jest pomaganie użytkownikowi w rozwiązywaniu problemów, odpowiadanie na pytania i dostarczanie informacji w sposób uprzejmy i zrozumiały."

	return NewAssistant(systemRole, assistantName)
}
