import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import './CenterPanel.css';

class CenterPanel extends Component<object, any> {
  render() {
    return (
      <Row>
        <Col xs={2}></Col>
        {this.props.children}
        <Col xs={2}></Col>
      </Row>
    );
  }
}

export default CenterPanel;