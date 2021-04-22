const path = require('path');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const multer = require('multer');
const session = require('express-session');
const { format } = require('timeago.js');
const uuid = require('uuid/v4');
const flash = require('connect-flash');

// Initializations
const app = express();
require('./database');
require('./config/passport');

// settings
app.set('port', process.env.PORT || 3000);

// middlewares
// app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: 'mipalabrasecreta',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/img/uploads'),
  filename: function(req, file, cb, filename){
    cb(null, uuid()+path.extname(file.originalname))
  }
})
app.use(multer({storage}).single('image'))

// globals variables
app.use(function(req, res, next){
  app.locals.format = format;
  res.locals.successMsg = req.flash('successMsg');
  res.locals.errorMsg = req.flash('errorMsg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next()
})

// routes
app.use(require('./routes/index'))

// static files
app.use(express.static(path.join(__dirname, 'public')));

// start the server
app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);
});
