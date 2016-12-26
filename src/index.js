import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import App from './App';
import Admin from './Admin';
import auth, {Login} from './auth';
import './index.css';

var checkAdmin = function(nextState, replace) {
  if(!auth.isAdmin()) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    });
  }
};

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login}/>
      <Route path="admin" component={Admin} onEnter={checkAdmin}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
