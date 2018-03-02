const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const Item = require('../../models/item');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('GET', () => {
    it('renders item title and description', async () => {
      const item = await seedItemToDatabase();
      const singleItemPage = `/items/${item._id}`;
      const response = await request(app)
       .get(singleItemPage);

      assert.include(parseTextFromHTML(response.text, '#item-title'), item.title);
      assert.include(parseTextFromHTML(response.text, '#item-description'), item.description);
    } );
  });

  describe('GET', () => {
    it('renders filled in input fields', async () => {
      const item = await seedItemToDatabase();
      const editPage = `/items/${item._id}/edit`;
      // exercise
      const response = await request(app)
        .get(editPage);
      // verify
      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), item.title);
      assert.equal(parseTextFromHTML(response.text, 'input#imageUrl-input'), item.description);
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), item.imageUrl);
    });
  });

  describe('UPDATE', () => {
    it('creates updates an item', async () => {
      // setup
      const item = await seedItemToDatabase();
      const itemToUpdate = buildItemObject();
      const editPage = `/items/${item._id}/edit`;
      // exercise
      const response =  await request(app)
        .post(editPage)
        .type('form')
        .send(itemToUpdate);
      // verify
      const updatedItem = await Item.findOne(itemToUpdate);
      assert.isOk(updatedItem, 'Item was not updated successfully in the database');
    });

    it('renders updated version of single item', async () => {
      // setup
      const item = await seedItemToDatabase();
      const editPage = `/items/${item._id}/edit`;
      const itemToUpdate = buildItemObject();
      // exercise
      const response =  await request(app)
        .post(editPage)
        .type('form')
        .send(itemToUpdate);
      // verify
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, singleItemPage);
    });

    it('displays an error message when supplied an empty title', async () => {
      const invalidItemToUpdate = {
        description: 'test',
        imageUrl: 'https://www.placebear.com/200/300',
      };
      const item = await seedItemToDatabase();
      const editPage = `/items/${item._id}/edit`;
      const response = await request(app)
        .post(editPage)
        .type('form')
        .send(invalidItemToUpdate);
      const allItems = await Item.find({});
      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty description', async () => {
      const invalidItemToUpdate = {
        title: 'test',
        imageUrl: 'https://wwww.placebear.com/200/300'
      };
      const item = await seedItemToDatabase();
      const editPage = `/items/${item._id}/edit`;
      const response = await request(app)
        .post(editPage)
        .type('form')
        .send(invalidItemToUpdate);
      const allItems = await Item.find({});
      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty imageUrl', async () => {
      const invalidItemToUpdate = {
        title: 'test',
        description: 'A sample description'
      };
      const item = await seedItemToDatabase();
      const editPage = `/items/${item._id}/edit`;
      const response = await request(app)
        .post(editPage)
        .type('form')
        .send(invalidItemToUpdate);
      const allItems = await Item.find({});
      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

  });

  describe('DELETE', () => {
    it('should delete a specific item given the id', async () => {
      const item = await seedItemToDatabase();
      const singleItemPage = `/items/${item._id}`;
      const response = await request(app)
        .delete(singleItemPage);

      assert.equal(response.status, 302);
    });
  })

});
