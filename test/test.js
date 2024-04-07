const { expectLoaded, expectPage, test } = require('@excaliburjs/testing');

test('A shootemup sample', async (page) => {
  await expectLoaded();
  await page.waitForTimeout(100);
  await expectPage('Shows start', './test/images/actual-play.png').toBe('./test/images/expected-play.png');
});