// Generated from: e2e\ui\features\02-post.feature
import { test } from "playwright-bdd";

test.describe('User Registration', () => {

  test('create a new post with valid details', async ({ Given, When, Then, And, page }) => { 
    await Given('I open the post page "http://localhost:3000/posts"', null, { page }); 
    await And('I enter the title "Test Title"', null, { page }); 
    await And('I enter the body "Test body for e2e testing."', null, { page }); 
    await And('I enter the slug "Test-Title"', null, { page }); 
    await And('I enter the banner "media/default_img.jpg"', null, { page }); 
    await And('I select the author "newuser" from the dropdown', null, { page }); 
    await When('I click the button "Skapa inlägg"', null, { page }); 
    await Then('I should see the post title heading "Test Title"', null, { page }); 
    await Then('I should see the text "Test body for e2e testing."', null, { page }); 
    await Then('I should see the text "Author: newuser"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\02-post.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I open the post page \"http://localhost:3000/posts\"","stepMatchArguments":[{"group":{"start":21,"value":"\"http://localhost:3000/posts\"","children":[{"start":22,"value":"http://localhost:3000/posts","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And I enter the title \"Test Title\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Test Title\"","children":[{"start":19,"value":"Test Title","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I enter the body \"Test body for e2e testing.\"","stepMatchArguments":[{"group":{"start":17,"value":"\"Test body for e2e testing.\"","children":[{"start":18,"value":"Test body for e2e testing.","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I enter the slug \"Test-Title\"","stepMatchArguments":[{"group":{"start":17,"value":"\"Test-Title\"","children":[{"start":18,"value":"Test-Title","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And I enter the banner \"media/default_img.jpg\"","stepMatchArguments":[{"group":{"start":19,"value":"\"media/default_img.jpg\"","children":[{"start":20,"value":"media/default_img.jpg","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And I select the author \"newuser\" from the dropdown","stepMatchArguments":[{"group":{"start":20,"value":"\"newuser\"","children":[{"start":21,"value":"newuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I click the button \"Skapa inlägg\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Skapa inlägg\"","children":[{"start":20,"value":"Skapa inlägg","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then I should see the post title heading \"Test Title\"","stepMatchArguments":[{"group":{"start":36,"value":"\"Test Title\"","children":[{"start":37,"value":"Test Title","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then I should see the text \"Test body for e2e testing.\"","stepMatchArguments":[{"group":{"start":22,"value":"\"Test body for e2e testing.\"","children":[{"start":23,"value":"Test body for e2e testing.","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see the text \"Author: newuser\"","stepMatchArguments":[{"group":{"start":22,"value":"\"Author: newuser\"","children":[{"start":23,"value":"Author: newuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end