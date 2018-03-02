const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');
const createPage = '/items/create';
const homePage = '/';

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your describe blocks below:
  describe('GET', () => {
    it('renders empty input fields', async () => {
      // exercise
      const response = await request(app)
        .get(createPage);
      // verify
      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'input#imageUrl-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), '');
    });
  });

  describe('POST', () => {
    it('creates a new item', async () => {
      // setup
      const itemToCreate = buildItemObject();
      // exercise
      const response =  await request(app)
        .post(createPage)
        .type('form')
        .send(itemToCreate);
      // verify
      const createdItem = await Item.findOne(itemToCreate);
      assert.isOk(createdItem, 'Item was not created successfully in the database');
    });

    it('redirects the user to homePage after creation', async () => {
      // setup
      const itemToCreate = buildItemObject();
      // exercise
      const response =  await request(app)
        .post(createPage)
        .type('form')
        .send(itemToCreate);
      // verify
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, homePage);
    });

    it('displays an error message when supplied an empty title', async () => {
      const invalidItemToCreate = {
        description: 'test',
        imageUrl: 'https://www.placebear.com/200/300',
      };

      const response = await request(app)
        .post(createPage)
        .type('form')
        .send(invalidItemToCreate);
      const allItems = await Item.find({});
      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty description', async () => {
      const invalidItemToCreate = {
        title: 'test',
        imageUrl: 'https://wwww.placebear.com/200/300'
      };

      const response = await request(app)
        .post(createPage)
        .type('form')
        .send(invalidItemToCreate);
      const allItems = await Item.find({});
      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied an empty imageUrl', async () => {
      const invalidItemToCreate = {
        title: 'test',
        description: 'A sample description'
      };

      const response = await request(app)
        .post(createPage)
        .type('form')
        .send(invalidItemToCreate);
      const allItems = await Item.find({});
      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

  });


});
