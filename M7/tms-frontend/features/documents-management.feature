Feature: Documents Management

  Scenario: zmiana nazwy
    Given I open the application at "http://localhost:5173"
    And I log in to the application
    When I navigate to the "Documents" tab
    And I find document with number "REJ-WA-LOG-2024"
    And I click the "Edit" button for this document
    And I change the document name to "Ala ma kota"
    And I click the "Save" button
    Then I should see the document name "Ala ma kota"
    And the "Edit" button should be visible
