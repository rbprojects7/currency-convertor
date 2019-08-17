import '@babel/polyfill';
import React from 'react';
import Helmet from 'react-helmet';
import { values } from 'lodash';
import { Provider } from 'mobx-react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { fixerAPIKey } from '../../config/app';
import { ServerStyleSheet, ThemeProvider } from 'styled-components';
import fetchJSON from './fetchPromise';
import AppState from '../store';
import routes from '../routes';
import App from '../client/containers/App';

const renderFullPage = (html, appstate, styleTags) => {
  const head = Helmet.rewind();
  const bundles = require('../../public/webpack-assets.json');
  let assets = values(bundles)
    .map((bundleName) => bundleName);
  const styles = assets.filter(file => file.endsWith('.css'));
  const scripts = assets.filter(file => file.endsWith('.js'));
  return `
    <!DOCTYPE html>
    <html ${head.htmlAttributes.toString()}>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        ${head.title.toString()}
        ${head.meta.toString()}
        ${styleTags}
        ${styles.map(file => `<link href="${file}" media="screen, projection" rel="stylesheet" type="text/css">`).join('\n')}
      </head>
      <body>
        <div id="app-container">${html}</div>
        <script>window.__INITIAL_STATE__ = ${JSON.stringify({ appstate: appstate.toJson() })};</script>
        ${scripts.map(file => `<script src="${file}"></script>`).join('\n')}
      </body>
    </html>
    `;
};

function serverRender(req, res) {
  const loadRouteData = () => {
    const promises = [];
    routes.some((route) => {
      const match = matchPath(req.url, route);
      promises.push(fetchJSON(`http://data.fixer.io/api/latest?access_key=${fixerAPIKey}`));
      return match;
    });
    return Promise.all(promises);
  };

  (async () => {
    try {
      const appstate = new AppState();
      await loadRouteData().then((response) => appstate.addItem(response[0].rates));
      const context = {};
      const sheet = new ServerStyleSheet();
      const componentStr = renderToString(sheet.collectStyles(<Provider appstate={appstate}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </Provider>));
      if (context.url) {
        res.status(301).setHeader('Location', context.url);
        res.end();
        return;
      }
      const status = context.status === '404' ? 404 : 200;
      const styleTags = sheet.getStyleTags();
      res.status(status).send(renderFullPage(componentStr, appstate, styleTags));
    } catch (err) {
      res.status(404).send('Not Found :(');
      console.error(`==> 😭  Rendering routes error: ${err}`);
    }
  })();
}

module.exports = serverRender;

