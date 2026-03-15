package driver_licenses

import (
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"
)

// validityYearsByCode defines the typical validity period (in years) for each license type.
var validityYearsByCode = map[LicenseTypeCode]int{
	LicenseC:  5,
	LicenseC1: 5,
	LicenseCE: 5,
	LicenseD:  5,
	ADRBasic:  5,
	ADRTank:   5,
	ADRClass1: 5,
	ADRClass7: 5,
	Konwojent: 2,
	HDS:       10,
	Forklift:  10,
	Hakowy:    10,
	Sanepid:   3,
	CertATP:   5,
	Kod95:     5,
}

// licenseTypeSets defines which license types are assigned per driver profile.
// Every driver gets a base set; some get additional specialist licenses.
var baseTypes = []LicenseTypeCode{LicenseC, LicenseCE, Kod95}

var additionalTypeGroups = [][]LicenseTypeCode{
	{ADRBasic},
	{ADRBasic, ADRTank},
	{ADRBasic, ADRClass1},
	{Forklift},
	{HDS},
	{Sanepid, CertATP},
	{Konwojent},
	{Hakowy},
	{LicenseD},
	{ADRBasic, Forklift},
}

// GenerateLicenseTypes returns the static list of license type dictionary rows.
func GenerateLicenseTypes() []LicenseType {
	return AllLicenseTypes()
}

// GenerateDriverLicenses generates realistic licenses for each driver.
// ~95% of licenses are active (expiry date in the future), ~5% are expired.
func GenerateDriverLicenses(driverCount int) []DriverLicense {
	licenseTypes := AllLicenseTypes()
	typeByCode := make(map[LicenseTypeCode]LicenseType, len(licenseTypes))
	for _, lt := range licenseTypes {
		typeByCode[lt.Code] = lt
	}

	now := time.Now()
	licenses := make([]DriverLicense, 0, driverCount*5)
	id := 1

	for driverID := 1; driverID <= driverCount; driverID++ {
		// Build set of license type codes for this driver (no duplicates)
		assigned := make(map[LicenseTypeCode]struct{})
		codes := make([]LicenseTypeCode, 0, 6)

		for _, code := range baseTypes {
			assigned[code] = struct{}{}
			codes = append(codes, code)
		}

		// Add 0-2 additional groups
		extraGroups := rand.Intn(3)
		perm := rand.Perm(len(additionalTypeGroups))
		added := 0
		for _, idx := range perm {
			if added >= extraGroups {
				break
			}
			for _, code := range additionalTypeGroups[idx] {
				if _, exists := assigned[code]; !exists {
					assigned[code] = struct{}{}
					codes = append(codes, code)
				}
			}
			added++
		}

		for _, code := range codes {
			lt := typeByCode[code]
			validYears := validityYearsByCode[code]

			// ~95% active, ~5% expired
			active := rand.Float32() < 0.95

			var issueDate, expiryDate time.Time
			var status LicenseStatus

			if active {
				// Issue date: 1-validYears years ago, expiry date still in the future
				issuedYearsAgo := 1 + rand.Intn(validYears)
				issueDate = now.AddDate(-issuedYearsAgo, -rand.Intn(12), -rand.Intn(28))
				expiryDate = issueDate.AddDate(validYears, 0, 0)
				// Ensure expiry is actually still in the future (push forward if needed)
				if !expiryDate.After(now) {
					expiryDate = now.AddDate(0, 1+rand.Intn(23), rand.Intn(28))
				}
				status = StatusActive
			} else {
				// Expired: issued in the past, expiry also in the past
				issuedYearsAgo := validYears + 1 + rand.Intn(3)
				issueDate = now.AddDate(-issuedYearsAgo, -rand.Intn(12), -rand.Intn(28))
				expiryDate = issueDate.AddDate(validYears, 0, 0)
				if expiryDate.After(now) {
					expiryDate = now.AddDate(0, -(1 + rand.Intn(12)), -rand.Intn(28))
				}
				status = StatusExpired
			}

			licenses = append(licenses, DriverLicense{
				ID:             id,
				DriverID:       driverID,
				LicenseTypeID:  lt.ID,
				DocumentNumber: generateDocumentNumber(code),
				IssueDate:      issueDate,
				ExpiryDate:     expiryDate,
				Status:         status,
			})
			id++
		}
	}

	return licenses
}

func generateDocumentNumber(code LicenseTypeCode) string {
	raw := strings.ToUpper(strings.ReplaceAll(string(code), "_", ""))
	if len(raw) < 3 {
		raw = raw + strings.Repeat("X", 3-len(raw))
	}
	prefix := raw[:3]
	return fmt.Sprintf("%s%06d", prefix, rand.Intn(1000000))
}

// GenerateLicenseTypesInsertStatements generates the INSERT for driver_license_types (static dictionary).
func GenerateLicenseTypesInsertStatements(types []LicenseType) string {
	if len(types) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(types) * 160)
	sb.WriteString("INSERT INTO driver_license_types (id, code, name, description) VALUES\n")

	for i, lt := range types {
		sb.WriteString("    (")
		sb.WriteString(strconv.Itoa(lt.ID))
		sb.WriteString(", '")
		sb.WriteString(strings.ReplaceAll(string(lt.Code), "'", "''"))
		sb.WriteString("', '")
		sb.WriteString(strings.ReplaceAll(lt.Name, "'", "''"))
		sb.WriteString("', '")
		sb.WriteString(strings.ReplaceAll(lt.Description, "'", "''"))
		sb.WriteString("')")

		if i < len(types)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}

// GenerateDriverLicensesInsertStatements generates the bulk INSERT for driver_licenses.
func GenerateDriverLicensesInsertStatements(licenses []DriverLicense) string {
	if len(licenses) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(licenses) * 180)
	sb.WriteString("INSERT INTO driver_licenses (id, driver_id, license_type_id, document_number, issue_date, expiry_date, status) VALUES\n")

	for i, l := range licenses {
		sb.WriteString("    (")
		sb.WriteString(strconv.Itoa(l.ID))
		sb.WriteString(", ")
		sb.WriteString(strconv.Itoa(l.DriverID))
		sb.WriteString(", ")
		sb.WriteString(strconv.Itoa(l.LicenseTypeID))
		sb.WriteString(", '")
		sb.WriteString(strings.ReplaceAll(l.DocumentNumber, "'", "''"))
		sb.WriteString("', '")
		sb.WriteString(l.IssueDate.Format("2006-01-02"))
		sb.WriteString("', '")
		sb.WriteString(l.ExpiryDate.Format("2006-01-02"))
		sb.WriteString("', '")
		sb.WriteString(string(l.Status))
		sb.WriteString("')")

		if i < len(licenses)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}
