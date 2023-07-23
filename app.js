// Importing required packages
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


const app = express();
const port = process.env.PORT || 3000;

// Setting up environment variables
require('dotenv').config();

// Middleware setup
app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());


// Configuring Views
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


// Routing
const routes = require('./server/routes/recipeRoutes.js')
app.use('/', routes);


// Listening to server
app.listen(port, ()=> console.log(`Listening to port ${port}`));


// hooosting et siteweb
// foodie-fusion.000webhostapp.com
//  foodie-fusion.lovestoblog.com

