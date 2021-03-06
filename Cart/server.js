// DEPENDENCIES
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
// const expressMessages = require('express-messages');
const path = require('path');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

// BOOTSTRAP

const config = require('./config/database');

// CONNECT TO db
mongoose.connect(config.database);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// INIT APP
let app = express();

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// SET PUBLIC FOLDER
app.use(express.static(path.join(__dirname, 'public/')));

// SET GLOBAL ERRORS VARIABLE
app.locals.errors = null;

// EXPRESS FILEUPLOAD Middleware
app.use(fileUpload());

// BODY PARSER APPLICATION URL ENCODED
app.use(bodyParser.urlencoded({ extended: false }))

// PARSER APPLICATION FOR JSON FILES
// app.use(bodyParser.json({ type: 'application/*+json' })); 

// Epress Parser
// app.use(
//   express.urlencoded({ extended: false })
// );
  
app.use(express.json());

// EXPRESS SESSIONS MIDDLEWARE
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

// EXPRESS VALIDATOR MIDDLEWARE
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    let namespace = param.split('.'), root = namespace.shift(), formParam = root;

    while (namespace.length) {
      formParam += `[${namespace.shift()}`;
    }
    return {
      parm: formParam,
      msg: msg,
      value: value
    };
  },

  customValidators: {
    isImage: function (value, filename) {
      var extension = (path.extname(filename)).toLowerCase();

      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default:
          return false;
      }
    }
  }
}))

// EXPRESS MESSAGES MIDDLEWARE FOR CONNECT FLASH
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// SET UP ROUTES
let adminCategories = require('./routes/admin_categories.js')
let adminPages = require('./routes/admin_pages.js')
let adminProducts = require('./routes/admin_products.js')
let pages = require('./routes/pages.js')

app.use('/admin/categories', adminCategories);
app.use('/admin/pages', adminPages);
app.use('/admin/products', adminProducts);
app.use('/', pages)

// START THE SERVER
const PORT = 3003;
app.listen(PORT, () =>
  console.log(`Server started on port http://localhost:${PORT}`)
);
// })
