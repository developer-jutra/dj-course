package main

import (
	"log"

	"tms-data-generator/generator"
)

const (
	outputFile            = "output/tms-latest.sql"
	cargoPlansOutputFile  = "output/tms-cargo-plans-latest.sql"
)

func main() {
	if err := generator.Generate(outputFile); err != nil {
		log.Fatalf("Failed to generate TMS SQL file: %v", err)
	}

	if err := generator.GenerateCargoPlans(cargoPlansOutputFile); err != nil {
		log.Fatalf("Failed to generate cargo plans SQL file: %v", err)
	}
}
