import React, { Component } from 'react';
import './App.css';
import MainContent from './components/MainContent/MainContent';
import CenterPanel from './components/CenterPanel/CenterPanel';

import { Col, Row, Navbar, Button, InputGroup, FormControl } from 'react-bootstrap';
import UserPane from './components/UserPane/UserPane';


class App extends Component {
  render() {
    return (
      <div className="app">
        <Navbar className="navbar"></Navbar>
        <Col>
          <CenterPanel>
            <MainContent>
              <UserPane />
            </MainContent>
          </CenterPanel>
          <Row className="footer"></Row>
        </Col>
      </div>
    );
  }
}

export default App;
