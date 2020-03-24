const { Router } = require('express');
const Course = require('../models/courses');
const router = Router();

function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count
  }));
}

function calcPrice(courses) {
  return courses.reduce((acc, course) => (acc += course.price * course.count), 0);
}

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const courses = mapCartItems(user.cart);

  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses,
    price: calcPrice(courses)
  });
});

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);

  await req.user.addToCart(course);
  res.redirect('/card');
});

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const courses = mapCartItems(user.cart);

  res.status(200).json({
    courses,
    price: calcPrice(courses)
  });
});

module.exports = router;
