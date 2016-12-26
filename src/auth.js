import React from 'react';
import { render } from 'react-dom';
import { withRouter } from 'react-router';
import 'whatwg-fetch';

var auth = {
  login(email, password, callback) {
    if(localStorage.user) {
      if(callback) callback();
      this.onChange();
      return;
    }

  fetch('/api/users/login')
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      if(json.err || !json.user) {
        console.log(json.err || 'user undefined');
      } else {
        localStorage.user = json.user;
      }
      if(callback) callback();
      this.onChange();
    });
  },

  logout(callback) {
    delete localStorage.user;
    if(callback) callback();
    this.onChange();
  },

  getUser() {
    return localStorage.user;
  },

  isLoggedIn() {
    return !!localStorage.user;
  },

  isAdmin() {
    if(localStorage.user && localStorage.user.isAdmin)
      return true;
    return false;
  },

  onChange() {

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

      auth.login(email, pass, function() {
        if (auth.isLoggedIn())
          return this.setState({ error: true });

        const location = this.props.location;

        if (location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname);
        } else {
          this.props.router.replace('/');
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
//
// export const Logout = withRouter(
//   React.createClass({
//     componentDidMount() {
//       auth.logout(function() {
//         this.props.router.replace('/');
//       });
//     },
//
//     render() {
//       return <p>You are now logged out</p>;
//     }
//   })
// );

module.exports = auth;
