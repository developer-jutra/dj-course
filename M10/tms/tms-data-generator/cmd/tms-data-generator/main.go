package main

import (
	"log"

	"tms-data-generator/generator"
)

const (
	outputFile = "output/tms-latest.sql"
)

func main() {
	err := generator.Generate(outputFile)
	if err != nil {
		log.Fatalf("Failed to generate SQL file: %v", err)
	}
}
