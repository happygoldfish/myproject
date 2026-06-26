Feature: User Registration

    Scenario: Register a new user with valid details
        Given I open the homepage "http://localhost:3000/"
        And I enter the username "newuser"
        And I enter the email "New@mail.org"
        And I enter the password "NewUser123!"
        When I click the button "Skapa användare"
        Then I should see the text "newuser"
        And I should see the text "New@mail.org"