const { Router } = require('express');
const bcrypt = require('bcryptjs');
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
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuth = true;

        req.session.save(err => {
          if (err) throw err;
          res.redirect('/');
        });
      } else {
        res.redirect('/auth/login#login');
      }
    } else {
      res.redirect('/auth/login#login');
    }
  } catch (err) {
    console.log('err: ', err);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, confirm, name } = req.body;

    const candidate = await User.findOne({ email });
    if (candidate) {
      res.redirect('/auth/login#register');
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashPassword,
        name,
        cart: {
          items: []
        }
      });

      await user.save();

      res.redirect('/auth/login#login');
    }
  } catch (err) {
    console.log('err: ', err);
  }
});

module.exports = router;
