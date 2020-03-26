const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const csrf = require('csurf');
const MongoStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const keys = require('./keys');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coureseRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorMiddleware = require('./middleware/error');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers'),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URL
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
  })
);
app.use(csrf());
app.use(flash());

app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coureseRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URL, {
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
