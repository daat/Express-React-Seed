import React, { Component } from 'react';
import auth from './auth';
import { Link } from 'react-router';
import './App.css';

class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      isLoggedIn: auth.isLoggedIn(),
      user: auth.getUser()
    };
  }

  updateAuth(_this) { // _this == this
    _this.setState({isLoggedIn: !!auth.isLoggedIn(), user: auth.getUser()});
  }

  componentWillMount() {
    auth.bindOnChange(this, this.updateAuth);
    auth.onChange = this.updateAuth;
  }

  clickLogout(event) {
    auth.logout();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src="/favicon.ico" className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ul>
          <li>
            {this.state.isLoggedIn && this.state.user ? (
              <Link to="/" onClick={this.clickLogout}> {this.state.user.name} Log out</Link>
            ) : (
              <Link to="/login">Sign in</Link>
            )}
          </li>
          <li><Link to="/admin">Dashboard</Link> (authenticated)</li>
        </ul>
        {this.props.children || <p>You are {!this.state.isLoggedIn && 'not'} logged in.</p>}
      </div>
    );
  }
}

export default App;
