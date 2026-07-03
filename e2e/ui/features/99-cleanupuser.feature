Feature: User Cleanup

    Scenario: clean up user after tests
        Given I open the user page "http://localhost:3000/users"
        When I click the button "Ta bort Användare"
        Then the user name heading "Test User" should no longer be visible on the page