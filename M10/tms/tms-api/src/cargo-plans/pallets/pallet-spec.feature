Feature: Pallet Spec Value Object

  # ── Poprawna kreacja przez factory methods ────────────────────────────────────

  Scenario: EPAL1 factory creates valid spec
    When I create pallet spec using epal1
    Then the pallet spec should be created successfully
    And the spec label should be "EPAL 1"
    And the spec dimensions should be 800 x 1200 x 144 mm
    And the spec max load should be 4000 kg

  Scenario: Industrial factory creates valid spec
    When I create pallet spec using industrial
    Then the pallet spec should be created successfully
    And the spec label should be "ISO-2"

  Scenario: Half pallet factory creates valid spec
    When I create pallet spec using half
    Then the pallet spec should be created successfully
    And the spec label should be "EPAL-6"
    And the spec dimensions should be 600 x 800 x 144 mm

  Scenario: CP1 factory creates valid spec
    When I create pallet spec using cp1
    Then the pallet spec should be created successfully
    And the spec label should be "CP1"
    And the spec max load should be 1190 kg

  Scenario: CP3 factory creates valid spec
    When I create pallet spec using cp3
    Then the pallet spec should be created successfully
    And the spec label should be "CP-3"
    And the spec dimensions should be 1140 x 1140 x 138 mm

  Scenario: H1 factory creates valid spec
    When I create pallet spec using h1
    Then the pallet spec should be created successfully
    And the spec label should be "H1"
    And the spec material should be "HDPE"

  # ── Walidacja label ───────────────────────────────────────────────────────────

  Scenario: Cannot create pallet spec with empty label
    When I try to create pallet spec with label "" material Wood cargo types "GENERAL" dimensions "800x1200x144" max load 4000
    Then it should fail with "Label cannot be empty"

  Scenario: Cannot create pallet spec with whitespace-only label
    When I try to create pallet spec with label "   " material Wood cargo types "GENERAL" dimensions "800x1200x144" max load 4000
    Then it should fail with "Label cannot be empty"

  # ── Walidacja allowed cargo types ─────────────────────────────────────────────

  Scenario: Cannot create pallet spec with no allowed cargo types
    When I try to create pallet spec with label "Custom" material Wood cargo types "" dimensions "800x1200x144" max load 4000
    Then it should fail with "at least one allowed cargo type"

  # ── Walidacja wymiarów ────────────────────────────────────────────────────────

  Scenario: Cannot create pallet spec with zero width
    When I try to create pallet spec with label "Bad" material Wood cargo types "GENERAL" dimensions "0x1200x144" max load 4000
    Then it should fail with "Dimensions must be positive"

  Scenario: Cannot create pallet spec with negative length
    When I try to create pallet spec with label "Bad" material Wood cargo types "GENERAL" dimensions "800x-100x144" max load 4000
    Then it should fail with "Dimensions must be positive"

  Scenario: Cannot create pallet spec with zero height
    When I try to create pallet spec with label "Bad" material Wood cargo types "GENERAL" dimensions "800x1200x0" max load 4000
    Then it should fail with "Dimensions must be positive"

  # ── Walidacja max load ────────────────────────────────────────────────────────

  Scenario: Cannot create pallet spec with zero max load
    When I try to create pallet spec with label "Bad" material Wood cargo types "GENERAL" dimensions "800x1200x144" max load 0
    Then it should fail with "Max load capacity"

  Scenario: Cannot create pallet spec with negative max load
    When I try to create pallet spec with label "Bad" material Wood cargo types "GENERAL" dimensions "800x1200x144" max load -100
    Then it should fail with "negative"
