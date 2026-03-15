package driver_licenses

import "time"

// LicenseTypeCode represents the code of a driver license type.
type LicenseTypeCode string

const (
	// Standard driving license categories
	LicenseC   LicenseTypeCode = "C"
	LicenseC1  LicenseTypeCode = "C1"
	LicenseCE  LicenseTypeCode = "C+E"
	LicenseD   LicenseTypeCode = "D"
	// ADR – Dangerous goods transport
	ADRBasic   LicenseTypeCode = "ADR_BASIC"
	ADRTank    LicenseTypeCode = "ADR_TANK"
	ADRClass1  LicenseTypeCode = "ADR_CLASS_1"
	ADRClass7  LicenseTypeCode = "ADR_CLASS_7"
	// Specialist & operational
	Konwojent  LicenseTypeCode = "KONWOJENT"
	HDS        LicenseTypeCode = "HDS"
	Forklift   LicenseTypeCode = "FORKLIFT_UDT"
	Hakowy     LicenseTypeCode = "HAKOWY"
	// Sanitary & hygiene
	Sanepid    LicenseTypeCode = "SANEPID"
	CertATP    LicenseTypeCode = "CERT_ATP"
	// Professional qualification
	Kod95      LicenseTypeCode = "KOD_95"
)

// LicenseStatus represents the status of a driver license.
type LicenseStatus string

const (
	StatusActive    LicenseStatus = "active"
	StatusExpired   LicenseStatus = "expired"
	StatusSuspended LicenseStatus = "suspended"
)

// LicenseType is a dictionary entry for a type of driver license.
type LicenseType struct {
	ID          int
	Code        LicenseTypeCode
	Name        string
	Description string
}

// DriverLicense represents a specific license held by a driver.
type DriverLicense struct {
	ID             int
	DriverID       int
	LicenseTypeID  int
	DocumentNumber string
	IssueDate      time.Time
	ExpiryDate     time.Time
	Status         LicenseStatus
}

// AllLicenseTypes returns the full catalogue of license types in deterministic order.
func AllLicenseTypes() []LicenseType {
	return []LicenseType{
		{ID: 1, Code: LicenseC, Name: "Prawo jazdy kat. C", Description: "Pojazdy ciężarowe powyżej 3,5t"},
		{ID: 2, Code: LicenseC1, Name: "Prawo jazdy kat. C1", Description: "Pojazdy ciężarowe 3,5t–7,5t"},
		{ID: 3, Code: LicenseCE, Name: "Prawo jazdy kat. C+E", Description: "Ciągnik siodłowy z naczepą"},
		{ID: 4, Code: LicenseD, Name: "Prawo jazdy kat. D", Description: "Transport osób (autokar, bus)"},
		{ID: 5, Code: ADRBasic, Name: "ADR Basic", Description: "Podstawowy kurs na przewóz towarów niebezpiecznych w sztukach przesyłki"},
		{ID: 6, Code: ADRTank, Name: "ADR Tank", Description: "Przewóz towarów niebezpiecznych w cysternach"},
		{ID: 7, Code: ADRClass1, Name: "ADR Klasa 1", Description: "Materiały wybuchowe"},
		{ID: 8, Code: ADRClass7, Name: "ADR Klasa 7", Description: "Materiały promieniotwórcze"},
		{ID: 9, Code: Konwojent, Name: "Kierowca-Konwojent", Description: "Transport wartości pieniężnych lub towarów wysokiego ryzyka"},
		{ID: 10, Code: HDS, Name: "HDS", Description: "Obsługa hydraulicznego dźwigu samochodowego"},
		{ID: 11, Code: Forklift, Name: "Wózki widłowe UDT", Description: "Uprawnienia UDT do obsługi wózków widłowych"},
		{ID: 12, Code: Hakowy, Name: "Uprawnienia Hakowego", Description: "Transport ponadgabarytowy i specjalistyczny"},
		{ID: 13, Code: Sanepid, Name: "Książeczka Sanepidowska", Description: "Wymagana przy transporcie żywności"},
		{ID: 14, Code: CertATP, Name: "Certyfikat ATP", Description: "Transport towarów szybko psujących się w kontrolowanej temperaturze"},
		{ID: 15, Code: Kod95, Name: "Kod 95", Description: "Kwalifikacja zawodowa kierowcy (obowiązkowa w UE)"},
	}
}
