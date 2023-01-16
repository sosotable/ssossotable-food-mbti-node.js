const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const config = new (require('./config/db_info').db_info)('ssossotest')
const options = {
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
};
const sessionStore = new MySQLStore(options)

const indexRouter = require('./routes/index');
const mainRouter = require('./routes/main');
const contentRouter = require('./routes/content');
const resultRouter = require('./routes/result');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**MARK: session 설정 부분
 * 항상 라우팅 앞에 두자
 * **/
app.use(
    session({
        key: process.env.SESSION_KEY,
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 10*60*1000 }
    })
);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MARK: 라우팅
app.use('/', indexRouter);
app.use('/main', mainRouter);
app.use('/content', contentRouter);
app.use('/result', resultRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
