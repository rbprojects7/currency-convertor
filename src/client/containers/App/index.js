import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import { uniqueId } from 'lodash';
import helmetconfig from '../../../../config/app';
import routes from '../../../routes';

const App = () => {
  const RouteWithSubRoutes = route => (
    <Route
      key={uniqueId()}
      exact={route.exact || false}
      path={route.path}
      render={props => (
        <route.component {...props} routes={route.routes || null} />
      )}
    />
  );
  return (
    <Fragment>
        <Helmet {...helmetconfig.header} />
        <Switch>{routes.map(route => RouteWithSubRoutes(route))}</Switch>
    </Fragment>
  );
};

export default App;
