const { Router } = require('express');
const Card = require('../models/card');
const Course = require('../models/courses');
const router = Router();

router.get('/', async (req, res) => {
  const card = await Card.fetch();
  res.render('/card', {
    title: 'Корзина',
    isCard: true,
    card
  });
});

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id);
  await Card.add(course);
  res.render('/card');
});

module.exports = router;
