Feature: Cargo Load Plan Aggregate

  # ── Finalizacja ───────────────────────────────────────────────────────────────

  Scenario: Cannot finalize empty plan
    Given an empty load plan with standard curtainside trailer
    When I try to finalize the plan
    Then it should fail with "Cannot finalize empty plan."

  Scenario: Can finalize plan with at least one unit
    Given a load plan with standard curtainside trailer
    And the plan has a general cargo pallet unit with weight 500 kg
    When I finalize the plan
    Then the plan status should be FINALIZED

  # ── Niezmienność zfinalizowanego planu ───────────────────────────────────────────

  Scenario: Cannot add unit to finalized plan
    Given a load plan with standard curtainside trailer
    And the plan has a general cargo pallet unit with weight 500 kg
    And the plan is finalized
    When I try to add another general cargo pallet unit with weight 400 kg
    Then it should fail with "Finalized plan cannot be modified."

  Scenario: Cannot remove unit from finalized plan
    Given a load plan with standard curtainside trailer
    And the plan has a general cargo pallet unit with weight 500 kg
    And the plan is finalized
    When I try to remove pallet unit with id "unit-1"
    Then it should fail with "Finalized plan cannot be modified."

  Scenario: Cannot replace trailer when plan is finalized
    Given a load plan with standard curtainside trailer
    And the plan has a general cargo pallet unit with weight 500 kg
    And the plan is finalized
    When I try to replace trailer with mega trailer
    Then it should fail with "Finalized plan cannot be modified."

  # ── Kompatybilność ładunków (Food vs Dangerous) ─────────────────────────────────

  Scenario: Cannot mix food with dangerous goods
    Given a load plan with standard curtainside trailer
    And the plan has a food pallet unit with weight 300 kg
    When I try to add a dangerous goods pallet unit with weight 400 kg
    Then it should fail with "Incompatible cargo"

  Scenario: Cannot mix food with chemical
    Given a load plan with refrigerated trailer
    And the plan has a food pallet unit with weight 300 kg
    When I try to add a chemical pallet unit with weight 400 kg
    Then it should fail with "Incompatible cargo"

  # ── Usuwanie jednostki ──────────────────────────────────────────────────────────

  Scenario: Cannot remove non-existent unit
    Given a load plan with standard curtainside trailer
    And the plan has a general cargo pallet unit with weight 500 kg
    When I try to remove pallet unit with id "non-existent-id"
    Then it should fail with "not found"

  # ── Pojemność (waga, LDM) ────────────────────────────────────────────────────────

  Scenario: Adding unit exceeding weight capacity fails
    Given a load plan with trailer having max weight 1000 kg
    And the plan has a general cargo pallet unit with weight 600 kg
    When I try to add another general cargo pallet unit with weight 500 kg
    Then it should fail with "Weight capacity exceeded"

  Scenario: Adding unit exceeding LDM capacity fails
    Given an empty load plan with trailer having max LDM 0.5 m
    When I try to add a general cargo pallet unit with weight 500 kg
    Then it should fail with "LDM capacity exceeded"

  # ── Wymagania naczepy (klimat, wysokość) ────────────────────────────────────────

  Scenario: Temperature-controlled cargo requires climate-controlled trailer
    Given an empty load plan with standard curtainside trailer
    When I try to add a food pallet unit with weight 300 kg and temperature control required
    Then it should fail with "Climate control required"

  Scenario: Unit exceeding trailer height is rejected
    Given an empty load plan with trailer having height 1500 mm
    When I try to add a general cargo pallet unit with total height 2000 mm and weight 500 kg
    Then it should fail with "too tall"
