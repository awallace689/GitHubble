import React, { Component } from 'react';
import './Login.css';

import Page from '../Page/Page';
import { Jumbotron } from 'react-bootstrap';


interface LoginState { }


interface LoginProps {
  oauthUrl: string,
  getOAuthToken: any
}


class Login extends Component<LoginProps, LoginState> {
  async componentDidMount() {
    await this.props.getOAuthToken();
  }
  
  render() {
    return (
      <Page>
        <Jumbotron>
          <h1>Welcome to <b>GitHubble!</b></h1>
          <br />
          <h3><a href={this.props.oauthUrl}>Connect</a> to <a href="https://github.com">GitHub</a> begin.</h3>
        </Jumbotron>
        <hr />
        <p><i>Connecting will redirect you GitHub's secure sign-in page. Upon connecting, you will be able to access the rest of the website!</i></p>
      </Page>
    );
  }
}

export default Login;