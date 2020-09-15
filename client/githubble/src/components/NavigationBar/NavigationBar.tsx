import React, { Component } from 'react';
import { Navbar, Button, Nav, NavDropdown } from 'react-bootstrap';

import './NavigationBar.css';
import { Link } from 'react-router-dom';


interface NavigationBarState { }


interface NavigationBarProps {
  signedIn: boolean,
  signOut: any,
  oauthUrl: string,
  // username: string
}


class NavigationBar extends Component<NavigationBarProps, NavigationBarState> {
  // getUsername(): string {
  //   let username = 
  // }

  render() {
    return (
      <Navbar collapseOnSelect expand="sm" className="page-navbar position-fixed shadow w-100">
        <Link to="/">
          <Navbar.Brand className="d-inline-block align-center">
            <img
              alt="Githubble logo"
              src={require('../../media/favicon.png')}
              width="50"
              height="50"
              style={{ background: '#476299' }}
              className="d-inline-block align-top rounded"
            />
            {' '}<b style={{ fontSize: '2rem' }}>GitHubble</b>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mr-auto">
            {/* <Nav.Link> */}
              <Link className="nav-link-styled" to="/home">
                Home
              </Link>
            {/* </Nav.Link> */}
            {/* <Nav.Link> */}
              <Link 
                className="nav-link-styled" 
                to="/profile"
                style={{ marginLeft: '15px' }}>
                Profile
              </Link>
            {/* </Nav.Link> */}
          </Nav>
          {this.props.signedIn
            ? <div
              className="position-relative ml-auto sign-btn "
              onClick={this.props.signOut}>
              Sign Out
            </div>
            : <a className="ml-auto" href={this.props.oauthUrl}>
              <div className="position-relative sign-btn">Sign in</div>
            </a>
          }
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;