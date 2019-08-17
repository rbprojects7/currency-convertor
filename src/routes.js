import Home from './client/containers/Home';
import NotFound from './client/containers/NotFound';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '*',
    component: NotFound,
  },
];
