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
import UserPane from './components/UserPane/UserPane';
import Page from './components/Page/Page';
import './App.css';
import NavigationBar from './components/NavigationBar/NavigationBar';


interface AppState {
  githubAuthHeader: { Authorization: string } | null,
}


class App extends Component<object, AppState> {
  oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`

  constructor(props: object) {
    super(props);

    this.state = {
      githubAuthHeader: null
    };

    this.getOAuthToken = this.getOAuthToken.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    let token = localStorage.getItem('github_oauth');
    if (token) {
      this.setState({ githubAuthHeader: { 'Authorization': `token ${token}` } });
    }
  }

  async getOAuthToken() {
    const queryParams = new URLSearchParams(new URL(window.location.href).search);
    const tokenCode = queryParams.get('code');
    if (queryParams.get('code') && !this.state.githubAuthHeader) {
      const result = await fetch(
        `http://localhost:8000/api/github/${tokenCode}`,
        { method: 'POST' }
      );

      const token = await result.text();
      localStorage.setItem('github_oauth', token);
      this.setState({ githubAuthHeader: { 'Authorization': `token ${token}` } })
    }
  }

  signOut() {
    localStorage.clear();
    this.setState({
      githubAuthHeader: null
    })
  }

  render() {
    const signedInSwitch =
      <Switch>
        <Route path="/compare">
          <Page>
            <Row>
              <Col xs={6}>
                <UserPane />
              </Col>
              <Col xs={6}>
                <UserPane />
              </Col>
            </Row>
          </Page>
        </Route>
        <Route path='/login'>
          <Redirect to="/compare" />
        </Route>
        <Route path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    const signedOutSwitch =
      <Switch>
        <Route path='/login'>
          <Login
            oauthUrl={this.oauthUrl}
            getOAuthToken={this.getOAuthToken} />
        </Route>
        <Route path='/'>
          <Redirect to='/login' />
        </Route>
      </Switch>

    return (
      <div className="app">
        <Router>
          <NavigationBar
            signedIn={!!this.state.githubAuthHeader}
            signOut={this.signOut}
            oauthUrl={this.oauthUrl} />
          {this.state.githubAuthHeader
            ? signedInSwitch
            : signedOutSwitch}
        </Router>
      </div>
    );
  }
}

export default App;
