// Generated from: e2e\ui\features\98-cleanuppost.feature
import { test } from "playwright-bdd";

test.describe('User Cleanup', () => {

  test('clean up user after tests', async ({ Given, When, Then, page }) => { 
    await Given('I open the homepage "http://localhost:3000/"', null, { page }); 
    await When('I click the button "Ta bort Post"', null, { page }); 
    await Then('the post title heading "Test Title" should no longer be visible on the page', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('e2e\\ui\\features\\98-cleanuppost.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I open the homepage \"http://localhost:3000/\"","stepMatchArguments":[{"group":{"start":20,"value":"\"http://localhost:3000/\"","children":[{"start":21,"value":"http://localhost:3000/","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I click the button \"Ta bort Post\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Ta bort Post\"","children":[{"start":20,"value":"Ta bort Post","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then the post title heading \"Test Title\" should no longer be visible on the page","stepMatchArguments":[{"group":{"start":23,"value":"\"Test Title\"","children":[{"start":24,"value":"Test Title","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end