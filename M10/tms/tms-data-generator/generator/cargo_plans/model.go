package cargo_plans

// TrailerType represents a trailer registry key stored in DB.
type TrailerType string

const (
	StandardCurtainside TrailerType = "standard-curtainside"
	Mega                TrailerType = "mega"
	Reefer              TrailerType = "reefer"
)

// PalletType represents a pallet spec registry key stored in DB.
type PalletType string

const (
	Epal1      PalletType = "epal1"
	Industrial PalletType = "industrial"
	Half       PalletType = "half"
	CP1        PalletType = "cp1"
	CP3        PalletType = "cp3"
	H1         PalletType = "h1"
)

// CargoType mirrors the domain enum value stored in DB.
type CargoType string

const (
	Food           CargoType = "FOOD"
	Chemical       CargoType = "CHEMICAL"
	Electronics    CargoType = "ELECTRONICS"
	DangerousGoods CargoType = "ADR"
	General        CargoType = "GENERAL"
)

// Status of a cargo load plan.
type Status string

const (
	Draft     Status = "DRAFT"
	Finalized Status = "FINALIZED"
)

// trailerSpec holds static configuration for each trailer type.
// Aligned with tms-api TrailerFactory capabilities.
type trailerSpec struct {
	Type                TrailerType
	HasClimateControl   bool
	SupportsSideLoading bool
	HasHighSecurityLock bool
	IsBulkReady         bool
}

// palletSpec holds static configuration for each pallet type.
type palletSpec struct {
	Type         PalletType
	AllowedCargo []CargoType
	// LDM contribution per unit on a standard trailer (simplified)
	LdmPerUnit   float64
	MaxWeightKg  float64
	BaseHeightMm int
}

var trailerSpecs = []trailerSpec{
	{StandardCurtainside, false, true, false, false},
	{Mega, false, true, false, false},
	{Reefer, true, false, true, false},
}

var palletSpecs = []palletSpec{
	{Epal1, []CargoType{General, Food, Electronics}, 0.40, 4000, 144},
	{Industrial, []CargoType{General, Electronics}, 0.50, 1500, 162},
	{Half, []CargoType{General, Food}, 0.27, 750, 144},
	{CP1, []CargoType{Chemical, DangerousGoods}, 0.50, 1190, 138},
	{CP3, []CargoType{Chemical, DangerousGoods}, 0.48, 1200, 138},
	{H1, []CargoType{Food}, 0.40, 5000, 160},
}

// Predefined plan IDs for .http examples – food, chemical, electronics, general.
// These ensure deterministic IDs for API smoke tests.
var PredefinedPlanIDs = map[CargoType]string{
	Food:        "11111111-1111-4111-a111-111111111101",
	Chemical:    "22222222-2222-4222-a222-222222222202",
	Electronics: "33333333-3333-4333-a333-333333333303",
	General:     "44444444-4444-4444-a444-444444444404",
	DangerousGoods: "55555555-5555-4555-a555-555555555505",
}

// CargoLoadPlan represents a persisted aggregate row.
type CargoLoadPlan struct {
	ID          string
	TrailerType TrailerType
	Status      Status
	CurrentLdm  float64
	Version     int
	CreatedAt   string
	UpdatedAt   string
	Units       []CargoLoadPlanUnit
}

// CargoLoadPlanUnit represents a persisted pallet unit row.
type CargoLoadPlanUnit struct {
	ID                     string
	LoadPlanID             string
	PalletType             PalletType
	CargoType              CargoType
	Description            string
	WeightKg               float64
	CargoHeightMm          int
	IsTemperatureControlled bool
	RequiresSideLoading    bool
	IsBulk                 bool
	HighSecurityRequired   bool
}
