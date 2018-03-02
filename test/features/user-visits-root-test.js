const {assert} = require('chai');

describe('User visits root', () => {
  const homePage = '/';
  describe('without existing items', () => {
    it('starts blank', () => {
      browser.url(homePage);
      const text = browser.getText('#items-container');
      assert.equal(text, '');
    });
  });

  describe('and can navigate', () => {
    it('to /create', () => {
      const createText = 'Create';
      browser.url(homePage);
      browser.click('a[href="/items/create"]');
      assert.include(browser.getText('body'), createText);
    });
  });

});
