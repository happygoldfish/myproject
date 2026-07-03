// Generated from: e2e\ui\features\99-cleanupuser.feature
import { test } from "playwright-bdd";

test.describe('User Cleanup', () => {

  test('clean up user after tests', async ({ Given, When, Then, page }) => { 
    await Given('I open the user page "http://localhost:3000/users"', null, { page }); 
    await When('I click the button "Ta bort Användare"', null, { page }); 
    await Then('the user name heading "Test User" should no longer be visible on the page', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\99-cleanupuser.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I open the user page \"http://localhost:3000/users\"","stepMatchArguments":[{"group":{"start":21,"value":"\"http://localhost:3000/users\"","children":[{"start":22,"value":"http://localhost:3000/users","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I click the button \"Ta bort Användare\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Ta bort Användare\"","children":[{"start":20,"value":"Ta bort Användare","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then the user name heading \"Test User\" should no longer be visible on the page","stepMatchArguments":[{"group":{"start":22,"value":"\"Test User\"","children":[{"start":23,"value":"Test User","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end