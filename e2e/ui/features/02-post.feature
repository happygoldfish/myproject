Feature: User Registration

    Scenario: create a new post with valid details
        Given I open the homepage "http://localhost:3000/"
        And I enter the title "Test Title"
        And I enter the body "Test body for e2e testing."
        And I enter the slug "Test-Title"
        And I enter the banner "media/default_img.jpg"
        And I select the author "newuser" from the dropdown
        When I click the button "Skapa inlägg"
        Then I should see the post title heading "Test Title"
        Then I should see the text "Test body for e2e testing."
        Then I should see the text "Author: newuser"