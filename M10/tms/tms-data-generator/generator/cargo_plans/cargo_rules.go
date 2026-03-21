package cargo_plans

// canCoload returns false if FOOD would be mixed with CHEMICAL or DANGEROUS_GOODS.
// Mirrors cargo-load-plan.rules.ts: canCoload()
func canCoload(cargoTypes []CargoType) bool {
	hasDangerous := false
	hasFood := false
	for _, c := range cargoTypes {
		if c == Chemical || c == DangerousGoods {
			hasDangerous = true
		}
		if c == Food {
			hasFood = true
		}
	}
	return !(hasFood && hasDangerous)
}

// isDangerous returns true for CHEMICAL or DANGEROUS_GOODS (ADR).
func isDangerous(c CargoType) bool {
	return c == Chemical || c == DangerousGoods
}

// UnitRequirements holds cargo unit handling requirements.
type UnitRequirements struct {
	IsTemperatureControlled bool
	RequiresSideLoading     bool
	IsBulk                  bool
	HighSecurityRequired    bool
}

// TrailerSatisfiesCargoRequirements checks whether the trailer meets all unit requirements.
// Mirrors cargo-load-plan.ts: ensureTrailerSatisfiesCargoRequirements()
func TrailerSatisfiesCargoRequirements(trailer trailerSpec, req UnitRequirements) bool {
	if req.IsTemperatureControlled && !trailer.HasClimateControl {
		return false
	}
	if req.RequiresSideLoading && !trailer.SupportsSideLoading {
		return false
	}
	if req.HighSecurityRequired && !trailer.HasHighSecurityLock {
		return false
	}
	if req.IsBulk && !trailer.IsBulkReady {
		return false
	}
	return true
}
