Feature: Pallet Spec Value Object

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
