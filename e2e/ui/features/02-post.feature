Feature: Create Post

    Scenario: create a new post with valid details
        Given I open the post page "http://localhost:3000/posts"
        And I log in with username "newuser" and password "NewUser123!"
        And I enter the title "Test Title"
        And I enter the body "Test body for e2e testing."
        And I enter the slug "Test-Title"
        When I click the button "Skapa inlägg"
        Then I should see the post title heading "Test Title"
        Then I should see the text "Test body for e2e testing."
        Then I should see the text "Author: newuser"