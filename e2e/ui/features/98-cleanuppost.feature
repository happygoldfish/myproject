Feature: Post Cleanup

    Scenario: clean up post after tests
        Given I open the post page "http://localhost:3000/posts"
        When I click the button "Ta bort Post"
        Then the post title heading "Test Title" should no longer be visible on the page