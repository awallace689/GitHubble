import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import './MainContent.css';

class MainContent extends Component<object, any> {
  render() {
    return (
      <Col xs="12" lg="8">
        <Col className="content rounded">
          {this.props.children}
        </Col>
      </Col>
    );
  }
}

export default MainContent;
          