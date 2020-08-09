import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Col, Row, Navbar, Button, InputGroup, FormControl, Jumbotron } from 'react-bootstrap';
import UserPane from './components/UserPane/UserPane';
import Page from './components/Page/Page';
import { client_id } from './secrets.js';

import './App.css';


interface AppState {
  loggedIn: boolean
}


class App extends Component<object, AppState> {
  oauth_url = `https://github.com/login/oauth/authorize?client_id=${client_id}`

  constructor(props: object) {
    super(props);

    this.state = {
      loggedIn: false
    };
  }

  render() {
    return (
      <div className="app">
        <Router>
          <Navbar className="page-navbar position-fixed shadow w-100">
            <img
              style={{ background: '#fff9f2' }}
              src="favicon.png"
              alt="Telescope logo"
              width="50"
              height="50" />
            <h1 className="ml-3">
              <b>GitHubble</b>
            </h1>
            <a className="ml-auto" href={this.oauth_url}>
              <Button className="position-relative">Sign in</Button>
            </a>
          </Navbar>
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
            <Route path="/">
              <Page>
                <Jumbotron>
                  <h1>Welcome to <b>GitHubble!</b></h1>
                  <br />
                  <h3><a href={this.oauth_url}>Connect</a> to <a href="https://github.com">GitHub</a> begin.</h3>
                </Jumbotron>
                  <hr />
                  <p><i>Connecting will redirect you GitHub's secure sign-in page. Upon connecting, you will be able to access the rest of the website!</i></p>
              </Page>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
