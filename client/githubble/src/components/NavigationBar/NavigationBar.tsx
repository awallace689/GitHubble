import React, { Component } from 'react';
import { Navbar, Button } from 'react-bootstrap';

import './NavigationBar.css';


interface NavigationBarState { }


interface NavigationBarProps {
  signedIn: boolean,
  signOut: any,
  oauthUrl: string
}


class NavigationBar extends Component<NavigationBarProps, NavigationBarState> {
  render() {
    return (
      <Navbar className="page-navbar position-fixed shadow w-100">
        <img
          className="rounded"
          style={{ background: '#476299' }}
          src="favicon.png"
          alt="Telescope logo"
          width="50"
          height="50" />
        <h1 className="ml-3 bold">
          <b>GitHubble</b>
        </h1>
        {this.props.signedIn
          ? <Button 
              className="position-relative ml-auto"
              onClick={this.props.signOut}>
                Sign out
            </Button>
          : <a className="ml-auto" href={this.props.oauthUrl}>
              <Button className="position-relative">Sign in</Button>
            </a>
        }
          
      </Navbar>
    );
  }
}

export default NavigationBar;