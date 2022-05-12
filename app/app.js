import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
//mport logger from 'morgan';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import createError from 'http-errors';
import applyRouter from './routes/apply';
import dashboardRouter from './routes/dashboard';
import submittedRouter from './routes/submitted';
import { auth } from 'express-openid-connect';
import 'dotenv/config';
import bodyParser from 'body-parser';
import multer from 'multer';
import logger from './services/logger';

const upload = multer();

var app = express();
const port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.set('port', port);

const config = {
  authRequired: false,
  auth0Logout: true
  // ** The following properties seem to be picked up automatically ** //

  //clientID: process.env.CLIENT_ID,
  //issuerBaseURL: process.env.ISSUER_BASE_URL,
  //secret: process.env.SECRET
};

const environment = process.env.NODE_ENV || 'development';
logger.info(`Environment: ${environment}`);
logger.info('Base Url: ', config.baseURL);

if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && environment !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

logger.info('processs.env.BASE_URL: ', process.env.BASE_URL);
logger.info('processs.env.PORT: ', process.env.PORT);
logger.info('Base Url: ', config.baseURL);

app.use(auth(config));
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 
app.use(upload.array());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  res.locals.isAuthenticated = req.oidc.isAuthenticated();
  res.locals.activeRoute = req.originalUrl;
  next();
});

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/apply', applyRouter);
app.use('/users', usersRouter);
app.use('/submitted', submittedRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  logger.info('>>> boom boom...');
  logger.info('>>> error: ', err.message);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

logger.info(`Running on http://localhost:${port}...`);


export default app;
