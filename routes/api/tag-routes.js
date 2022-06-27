const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    attributes: ['id', 'tag_name'],
    include: [
      {
        model: Product,
        through: ProductTag,
        attributes: [
          'id',
          'product_name',
          'price',
          'stock'
        ]
      }
    ]
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'tag_name'],
    include: [
      {
        model: Product,
        through: ProductTag,
        attributes: [
          'id',
          'product_name',
          'price',
          'stock'
        ]
      }
    ]
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'unable to find tag' })
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
  .then(dbTagData => {
    if (!req.body.tag_name) {
      res.status(400).json({ message: 'bad request' })
      return;
    }
    res.json(dbTagData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if (!req.body.tag_name) {
      res.status(400).json({ message: 'bad request' })
      return;
    }

    if (!dbTagData) {
      res.status(404).json({ message: 'unable to find tag to update' })
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'tag not found' })
      return;
    }
    res.json(dbTagData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
});

module.exports = router;
