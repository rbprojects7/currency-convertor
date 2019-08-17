require('@babel/register');
const morgan = require('morgan');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const cors = require('cors');
const flash = require('connect-flash');
const apiMiddleware = require('./api');
const authCheck = require('./authCheck');
let { port, host } = require('../../config/app');

const app = express();

app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }));
app.use(express.static('public'));

app.use(cookieParser());
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'ilovescotch' }));
app.use(flash());

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const config = require('../../config/webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotDevMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);
  const devMiddlewareConfig = {
    noInfo: true,
    stats: { colors: true },
    publicPath: config.output.publicPath,
  };
  app.use(devMiddleware(compiler, devMiddlewareConfig));
  app.use(hotDevMiddleware(compiler));
}

const whitelist = [`http://${host}`];
const corsOptions = {
  origin: (origin, callback) => {
    if ((whitelist.indexOf(origin) !== -1) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/api', cors(corsOptions), authCheck, apiMiddleware);
app.get('*', require('./renderServerSide'));

app.listen(port, (error) => {
  if (error) console.error(error);
  console.info(`==> 🌎  Listening on port ${port}`);
});
