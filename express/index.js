const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coureseRoutes = require('./routes/courses');
const cardRouter = require('./routes/card');
require('dotenv').config();

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coureseRoutes);
app.use('/card', cardRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = `${process.env.DB_CONN}${process.env.DB_NAME}`;

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log('err: ', err);
  }
}

start();
