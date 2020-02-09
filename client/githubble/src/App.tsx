import React, { Component } from 'react';
import './App.css';
import MainContent from './components/MainContent/MainContent';
import Call from './components/Call/Call';
import CenterPanel from './components/CenterPanel/CenterPanel';

import { Col, Row, Navbar } from 'react-bootstrap';


class App extends Component {
  render() {
    return (
      <div className="app">
        <Navbar className="navbar"></Navbar>
        <Col >
          <CenterPanel>
            <MainContent>
              <Call></Call>
            </MainContent>
          </CenterPanel>
          <Row className="footer"></Row>
        </Col>
      </div>
    );
  }
}

export default App;
