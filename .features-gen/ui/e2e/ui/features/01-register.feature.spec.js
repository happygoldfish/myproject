// Generated from: e2e\ui\features\01-register.feature
import { test } from "playwright-bdd";

test.describe('User Registration', () => {

  test('Register a new user with valid details', async ({ Given, When, Then, And, page }) => { 
    await Given('I open the user page "http://localhost:3000/users"', null, { page }); 
    await And('I enter the username "newuser"', null, { page }); 
    await And('I enter the email "New@mail.org"', null, { page }); 
    await And('I enter the password "NewUser123!"', null, { page }); 
    await When('I click the button "Submit"', null, { page }); 
    await Then('I should see the username heading "newuser"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\01-register.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I open the user page \"http://localhost:3000/users\"","stepMatchArguments":[{"group":{"start":21,"value":"\"http://localhost:3000/users\"","children":[{"start":22,"value":"http://localhost:3000/users","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And I enter the username \"newuser\"","stepMatchArguments":[{"group":{"start":21,"value":"\"newuser\"","children":[{"start":22,"value":"newuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And I enter the email \"New@mail.org\"","stepMatchArguments":[{"group":{"start":18,"value":"\"New@mail.org\"","children":[{"start":19,"value":"New@mail.org","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And I enter the password \"NewUser123!\"","stepMatchArguments":[{"group":{"start":21,"value":"\"NewUser123!\"","children":[{"start":22,"value":"NewUser123!","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I click the button \"Submit\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Submit\"","children":[{"start":20,"value":"Submit","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then I should see the username heading \"newuser\"","stepMatchArguments":[{"group":{"start":34,"value":"\"newuser\"","children":[{"start":35,"value":"newuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end