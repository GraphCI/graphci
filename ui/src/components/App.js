import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Redirect } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import store from '../store';
import RunsWrapper from './RunsWrapper';

const history = createBrowserHistory();

export default () => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route exact path="/" render={() => (<Redirect to="/web" />)} />
        <Route exact path="/web" render={() => (<Redirect to="/web/runs" />)} />
        <Route path="/web/runs" component={RunsWrapper} />
      </div>
    </Router>
  </Provider>
);
