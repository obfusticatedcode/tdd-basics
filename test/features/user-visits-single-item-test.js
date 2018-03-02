const { assert } = require('chai');

const { buildItemObject } = require('../test-utils');

describe('User visits single item', () => {
  const createPage = '/items/create';
  const selector = '.item-card a';
  const updateButton = '#submit-button';
  const itemToCreate = buildItemObject();

  describe('visit homePage via createPage redirect', () => {
    it('can click and view single existing item', () => {
      browser.url(createPage);
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');

      browser.click(selector);

      assert.include(browser.getText('body'), itemToCreate.description);
      assert.include(browser.getText('body'), itemToCreate.title);
    });
  });

  describe('visit singleItemPage via homePage', () => {
    it('can update an item', () => {
      browser.url(createPage);
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');

      browser.click(selector);
      browser.click('a[href="/items/show"]');
      
      assert.include(browser.getText('body'), itemToCreate.description);
      assert.include(browser.getText('body'), itemToCreate.title);
    });

    it('can delete an item', () => {

      browser.url(createPage);
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');

      browser.click(selector);

      const text = browser.getText('#items-container');
      assert.include(text);
    });
  });

});
