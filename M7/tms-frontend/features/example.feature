Feature: Playwright Search

  Scenario: Verify Playwright homepage title
    Given I navigate to "https://playwright.dev"
    Then The page title should contain "Playwright"
