const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
const keys = require('../keys');
const regEmail = require('../email/registration');
const resetEmail = require('../email/reset');
const crypto = require('crypto');

const router = Router();
sgMail.setApiKey(keys.SENDGRID_API_KEY);

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    registerError: req.flash('registerError'),
    loginError: req.flash('loginError')
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
        req.flash('loginError', 'Неверный пароль');
        res.redirect('/auth/login#login');
      }
    } else {
      req.flash('loginError', 'Такого пользователя не существует');
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
      req.flash('registerError', 'Такой email занят!');
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

      await sgMail.send(regEmail(email));
    }
  } catch (err) {
    console.log('err: ', err);
  }
});

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }

  try {
    const candidate = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (!candidate) {
      return res.redirect('/auth/login');
    } else {
      res.render('auth/password', {
        title: 'Задать новый пароль',
        isLogin: true,
        error: req.flash('error'),
        userId: candidate._id.toString(),
        token: req.params.token
      });
    }
  } catch (err) {
    console.log('err: ', err);
  }
});

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Забыли пароль?',
    isLogin: true,
    error: req.flash('error')
  });
});

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Что-то пошло не так, попробуйте попытку позже');
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await sgMail.send(resetEmail(candidate.email, token));
        res.redirect('/auth/login');
      } else {
        req.flash('error', 'Такого email нет');
        res.redirect('/auth/reset');
      }
    });
  } catch (err) {
    console.log('err: ', err);
  }
});

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;

      await user.save();

      res.redirect('/auth/login');
    } else {
      req.flash('loginError', 'Время жизни токена истекло');
      res.redirect('/auth/login');
    }
  } catch (err) {
    console.log('err: ', err);
  }
});

module.exports = router;
