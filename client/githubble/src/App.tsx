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


interface AppState {
  token: string,
}


class App extends Component<object, AppState> {
  oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`

  constructor(props: object) {
    super(props);

    this.state = {
      token: "",
    };

    this.getOAuthToken = this.getOAuthToken.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    let token = localStorage.getItem('github_oauth');
    if (token) {
      this.setState({ token: token });
    }
  }

  async getOAuthToken() {
    const queryParams = new URLSearchParams(new URL(window.location.href).search);
    const tokenCode = queryParams.get('code');
    if (queryParams.get('code') && !this.state.token) {
      const result = await fetch(
        `http://localhost:8000/api/github/${tokenCode}`,
        { method: 'POST' }
      );

      const token = await result.text();
      localStorage.setItem('github_oauth', token);
      this.setState({ token: token })
    }
  }

  signOut() {
    localStorage.clear();
    this.setState({
      token: ""
    })
  }

  render() {
    const signedInSwitch =
      <Switch>
        <Route path="/user">
          <Page>
            <Row>
              <Col>
                <UserPage token={this.state.token} />
              </Col>
            </Row>
          </Page>
        </Route>
        <Route path='/login'>
          <Redirect to="/user" />
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
