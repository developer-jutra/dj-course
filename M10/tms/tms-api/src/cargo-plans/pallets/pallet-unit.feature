Feature: Pallet Unit Entity

  # ── Poprawna kreacja z różnymi specyfikacjami ──────────────────────────────────

  Scenario: EPAL1 spec permits GENERAL cargo and computes correct total height
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 500 kg cargo height 100 mm
    Then the pallet unit should be created successfully
    And total height should be 244 mm

  Scenario: EPAL1 spec permits FOOD cargo
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type FOOD weight 300 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  Scenario: EPAL1 spec permits ELECTRONICS cargo
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type ELECTRONICS weight 200 kg cargo height 50 mm
    Then the pallet unit should be created successfully

  Scenario: H1 spec permits FOOD cargo
    Given H1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type FOOD weight 400 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  Scenario: CP1 spec permits CHEMICAL cargo
    Given CP1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type CHEMICAL weight 800 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  Scenario: CP1 spec permits ADR cargo
    Given CP1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type ADR weight 500 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  Scenario: Industrial spec permits GENERAL cargo
    Given Industrial pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 1000 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  # ── Walidacja typu ładunku ─────────────────────────────────────────────────────

  Scenario: EPAL1 spec rejects CHEMICAL cargo as not allowed
    Given EPAL1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type CHEMICAL weight 500 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  Scenario: EPAL1 spec rejects ADR cargo as not allowed
    Given EPAL1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type ADR weight 500 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  Scenario: H1 spec rejects GENERAL cargo as not allowed
    Given H1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type GENERAL weight 300 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  Scenario: CP1 spec rejects FOOD cargo as not allowed
    Given CP1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type FOOD weight 300 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  Scenario: Industrial spec rejects FOOD cargo as not allowed
    Given Industrial pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type FOOD weight 300 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  # ── Walidacja wagi ─────────────────────────────────────────────────────────────

  Scenario: EPAL1 spec rejects cargo weight exceeding max load capacity
    Given EPAL1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type GENERAL weight 5000 kg cargo height 100 mm
    Then it should fail with "exceeds"

  Scenario: Industrial spec rejects cargo weight exceeding 1500 kg limit
    Given Industrial pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type GENERAL weight 2000 kg cargo height 100 mm
    Then it should fail with "exceeds"

  Scenario: CP1 spec rejects cargo weight exceeding 1190 kg limit
    Given CP1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type CHEMICAL weight 1500 kg cargo height 100 mm
    Then it should fail with "exceeds"

  Scenario: Cargo weight exactly at the spec limit is accepted
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 4000 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  # ── Obliczanie całkowitej wysokości ────────────────────────────────────────────

  Scenario: Total height equals pallet base plus cargo height
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 500 kg cargo height 200 mm
    Then the pallet unit should be created successfully
    And total height should be 344 mm

  Scenario: Half pallet spec computes total height as base height plus cargo height
    Given Half pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 500 kg cargo height 150 mm
    Then the pallet unit should be created successfully
    And total height should be 294 mm
