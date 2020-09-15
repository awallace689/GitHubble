import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Col, Row } from 'react-bootstrap';
import fetch from 'node-fetch';

import { client_id as clientId } from './secrets.js';
import Login from './components/Login/Login';
import UserPage from './components/UserPage/UserPage';
import Page from './components/Page/Page';
import './App.css';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Home from './components/Home/Home';
import ComparePage from './components/ComparePage/ComparePage';


interface AppState {
  token: string,
  username: string
}


class App extends Component<object, AppState> {
  oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`

  constructor(props: object) {
    super(props);

    this.state = {
      token: "",
      username: ""
    };

    this.getAuthenticatedUser = this.getAuthenticatedUser.bind(this);
    this.signOut = this.signOut.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    let token = localStorage.getItem('github_oauth');
    let username = localStorage.getItem('username');
    if (token && username) {
      this.setState({ token: token, username: username });
    }
  }

  updateUser(username: string, callback?: () => void) {
    if (callback) {
      this.setState({ username: username }, callback);
    }
    else {
      this.setState({ username: username });
    }
  }

  async getAuthenticatedUser(): Promise<void> {
    const queryParams = new URLSearchParams(new URL(window.location.href).search);
    const tokenCode = queryParams.get('code');
    if (tokenCode && !this.state.token) {
      const token = await this.getToken(tokenCode);
      const username = await this.getUsername(token);

      localStorage.setItem('github_oauth', token);
      localStorage.setItem('username', username);
      this.setState({ token: token, username: username })
    }
  }

  async getUsername(token: string): Promise<string> {
    let result = await fetch(
      'http://localhost:8000/api/github/user',
      {
        method: 'POST',
        body: JSON.stringify({ token: token }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    let resultJson = await result.json();
    console.log('res', resultJson)
    const username = resultJson.data.viewer.login
    return username;
  }

  async getToken(authCode: string): Promise<string> {
    const result = await fetch(
      `http://localhost:8000/api/github/${authCode}`,
      { method: 'POST' }
    );

    const token = await result.text();
    return token
  }

  signOut(): void {
    localStorage.clear();
    this.setState({
      token: ""
    })
  }

  render() {
    const signedInSwitch =
      <Switch>
        <Route path="/profile/:username">
          <UserPage
            token={this.state.token}
            updateUser={this.updateUser}
            username={this.state.username} />
        </Route>
        <Route path="/profile">
          <Redirect to={`/profile/${this.state.username}`} />
        </Route>
        <Route path="/compare/:username">
          <ComparePage 
            token={this.state.token}
            updateUser={this.updateUser}
            username={this.state.username} />
        </Route>
        <Route path="/compare">
          <Redirect to={`/compare/${this.state.username}`} />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path='/login'>
          <Redirect to="/home" />
        </Route>
        <Route path="/">
          <Redirect to="/home" />
        </Route>
      </Switch>
    const signedOutSwitch =
      <Switch>
        <Route path='/login'>
          <Login
            oauthUrl={this.oauthUrl}
            getOAuthToken={this.getAuthenticatedUser} />
        </Route>
        <Route path='/'>
          <Redirect to='/login' />
        </Route>
      </Switch>

    return (
      <div className="app">
        <Router>
          <NavigationBar
            signedIn={!!this.state.token}
            signOut={this.signOut}
            oauthUrl={this.oauthUrl} />
          {this.state.token
            ? signedInSwitch
            : signedOutSwitch}
        </Router>
      </div>
    );
  }
}

export default App;
