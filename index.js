const express = require('express');
const app = express();
const port = 9000;
const db=require('./config/mongoose');
const cookieParser=require('cookie-parser');

// Used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

// for google oauth
const passportGoogle=require('./config/passport-google-oauth2-strategy');

const MongoStore=require('connect-mongo')(session);

// add connect flash
const flash=require('connect-flash');
const customMware=require('./config/middleware');

const bodyParser = require('body-parser');
const request = require('request');

// add sass 
const sassMiddleware=require('node-sass-middleware');
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));


// for encode POST request
app.use(express.urlencoded());      

// use cookie as middleware
app.use(cookieParser());

// include layouts library
const expressLayouts=require('express-ejs-layouts');
app.use(expressLayouts);

// Extract our style and script tag from sub-pages and put it into head of layout page
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// Give access or set path for static files
app.use(express.static('./assets'));

// Set up view engine
app.set('view engine','ejs');
app.set('views','./views');

// mongo store used to store session-cookie
app.use(session({
    name: 'codeial',
    // Todo change the secret before deployment in production mode
    secret: 'xyzsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'Connect-mongodb setup ok');
        
    }
    )
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// Set up flash to use it
app.use(flash());
app.use(customMware.setFlash);

// Use express router
app.use('/',require('./routes'));

app.post('/captcha', function(req, res) {
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
  {
    return res.json({"responseError" : "Please select captcha first"});
  }
  const secretKey = "6LcSr7QZAAAAAD1-kjlGx20ySPYZ0Qw_BB5jKCDF";

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL,function(error,response,body) {
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      return res.json({"responseError" : "Failed captcha verification"});
    }
    res.json({"responseSuccess" : "Sucess"});
  });
});


app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running tha server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
}); 


