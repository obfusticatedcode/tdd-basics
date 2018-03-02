const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('when user visits create page', () => {
  describe('post a new item', () => {
    it('can be rendered', () => {
      const itemToCreate = buildItemObject();
      const createPage = '/items/create';

      browser.url(createPage);
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');

      assert.include(browser.getText('body'), itemToCreate.title);
      assert.include(browser.getAttribute('body img', 'src'), itemToCreate.imageUrl);
    });
  });
});
