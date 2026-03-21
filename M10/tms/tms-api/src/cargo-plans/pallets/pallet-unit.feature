Feature: Pallet Unit Entity

  # ── Poprawna kreacja z różnymi specyfikacjami ──────────────────────────────────

  Scenario: Can create EPAL1 pallet with general cargo within weight limit
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 500 kg cargo height 100 mm
    Then the pallet unit should be created successfully
    And total height should be 244 mm

  Scenario: Can create EPAL1 pallet with food cargo
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type FOOD weight 300 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  Scenario: Can create EPAL1 pallet with electronics cargo
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type ELECTRONICS weight 200 kg cargo height 50 mm
    Then the pallet unit should be created successfully

  Scenario: Can create H1 pallet with food cargo
    Given H1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type FOOD weight 400 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  Scenario: Can create CP1 pallet with chemical cargo
    Given CP1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type CHEMICAL weight 800 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  Scenario: Can create CP1 pallet with dangerous goods
    Given CP1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type ADR weight 500 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  Scenario: Can create industrial pallet with general cargo
    Given Industrial pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 1000 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  # ── Walidacja typu ładunku ─────────────────────────────────────────────────────

  Scenario: Cannot create EPAL1 with chemical cargo
    Given EPAL1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type CHEMICAL weight 500 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  Scenario: Cannot create EPAL1 with dangerous goods
    Given EPAL1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type ADR weight 500 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  Scenario: Cannot create H1 pallet with general cargo
    Given H1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type GENERAL weight 300 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  Scenario: Cannot create CP1 pallet with food cargo
    Given CP1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type FOOD weight 300 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  Scenario: Cannot create industrial pallet with food cargo
    Given Industrial pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type FOOD weight 300 kg cargo height 100 mm
    Then it should fail with "not allowed on"

  # ── Walidacja wagi ─────────────────────────────────────────────────────────────

  Scenario: Cannot create EPAL1 pallet exceeding max load capacity
    Given EPAL1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type GENERAL weight 5000 kg cargo height 100 mm
    Then it should fail with "exceeds"

  Scenario: Cannot create industrial pallet exceeding 1500 kg capacity
    Given Industrial pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type GENERAL weight 2000 kg cargo height 100 mm
    Then it should fail with "exceeds"

  Scenario: Cannot create CP1 pallet exceeding 1190 kg capacity
    Given CP1 pallet spec
    When I try to create a pallet unit with id "pu-1" cargo type CHEMICAL weight 1500 kg cargo height 100 mm
    Then it should fail with "exceeds"

  Scenario: Can create pallet at exact max capacity
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 4000 kg cargo height 100 mm
    Then the pallet unit should be created successfully

  # ── Obliczanie całkowitej wysokości ────────────────────────────────────────────

  Scenario: Total height equals pallet base plus cargo height
    Given EPAL1 pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 500 kg cargo height 200 mm
    Then the pallet unit should be created successfully
    And total height should be 344 mm

  Scenario: Half pallet with custom cargo height
    Given Half pallet spec
    When I create a pallet unit with id "pu-1" cargo type GENERAL weight 500 kg cargo height 150 mm
    Then the pallet unit should be created successfully
    And total height should be 294 mm
