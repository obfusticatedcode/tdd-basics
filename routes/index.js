const router = require('express').Router();

const Item = require('../models/item');
const homePage = '/';
const createPage = '/items/create';
const singleItemPage = '/items/:id';

router.get(homePage, async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

// Add additional routes below:
router.get(createPage, async (req, res, next) => {
  res.render('create');
});

router.post(createPage, async (req, res, next) => {
  const {title, description, imageUrl} = req.body;
  const newItem = new Item({title, description, imageUrl});
  newItem.validateSync();
  if (newItem.errors) {
    res.status(400)
      .render('create', {newItem: newItem});
  } else {
    await newItem.save();
    res.redirect(homePage);
  }
});

router.get(singleItemPage, async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .then((item) => {
      if (!item) return res.status(404).end('Not found');
      res.render('show', { item });
    })
    .catch((err) => {
      res.status(500).render('error', {err});
    });
});

router.get('/items/:id/edit', async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .then((item) => {
      if(!item) return res.status(404).send('Not found');
      res.render('edit', { item });
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
});

router.put(singleItemPage, async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .then((item) => {
      if(!item) return res.status(404).send('Not found');

      for(const field in req.body) {
        item[field] = req.body[field];
      }

      return item.save();
    })
    .then((item) => {
      res.redirect(`/items/${item.id}`);
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
});

router.delete(singleItemPage, async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .then((item) => {
      if (!item) return res.status(404).send('Not found');

      return item.remove();
    })
    .then(() => {
      res.redirect(homePage);
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
});

module.exports = router;
