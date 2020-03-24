const { Router } = require('express');
const User = require('../models/user');
const router = Router();

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

router.post('/login', async (req, res) => {
  const user = await User.findById('5e79b198c9c948139cb8ca8f');
  req.session.user = user;
  req.session.isAuth = true;

  req.session.save(err => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;
