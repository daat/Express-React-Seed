import React from 'react';
import { render } from 'react-dom';
import { withRouter } from 'react-router';
import 'whatwg-fetch';

export var auth = {
  login(email, password, obj, callback) {
    if(localStorage.user) {
      if(callback) callback(obj);
      this.onChange(this.bindObj);
      return;
    }

    let _this = this;

    fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({email: email, password: password})
    })
      .then(function(res) {
        return res.json();
      })
      .then(function(json) {
        if(json.err || !json.user) {
          console.log(json.err || 'user undefined');
        } else {
          localStorage.user = JSON.stringify(json.user);
        }
        if(callback) callback(obj);
        _this.onChange(_this.bindObj);
      });

  },

  logout(callback) {
    delete localStorage.user;
    if(callback) callback();
    this.onChange(this.bindObj);
  },

  getUser() {
    return this.isLoggedIn()? JSON.parse(localStorage.user): null;
  },

  isLoggedIn() {
    return !!localStorage.user;
  },

  isAdmin() {
    if(this.isLoggedIn() && this.getUser().isAdmin)
      return true;
    return false;
  },

  bindObj: null,

  bindOnChange(obj, func) {
    this.bindObj = obj;
    this.onChange = func;
  },

  onChange(obj) {

  },

};

export const Login = withRouter(
  React.createClass({

    getInitialState() {
      return {
        error: false
      };
    },

    submit(event) {
      event.preventDefault();
      const email = this.refs.email.value;
      const pass = this.refs.pass.value;

      auth.login(email, pass, this, function(_this) { // _this == this
        if(!auth.isLoggedIn())
          return _this.setState({ error: true });

        const location = _this.props.location;

        if (location.state && location.state.nextPathname) {
          _this.props.router.replace(location.state.nextPathname);
        } else {
          _this.props.router.replace('/');
        }
      });
    },

    render() {
      return (
        <form onSubmit={this.submit}>
          <label><input ref="email" placeholder="email" defaultValue="joe@example.com" /></label>
          <label><input ref="pass" placeholder="password" /></label> (hint: password1)<br />
          <button type="submit">login</button>
          {this.state.error && (
            <p>Bad login information</p>
          )}
        </form>
      );
    }
  })
);

export default auth;
