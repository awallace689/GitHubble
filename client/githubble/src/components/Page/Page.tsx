import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import './Page.css';
import CenterPanel from '../CenterPanel/CenterPanel';
import MainContent from '../MainContent/MainContent';

class Page extends Component<object, any> {
  render() {
    return (
      <Col className="scroll-me">
        <CenterPanel>
          <MainContent>
            { this.props.children }
          </MainContent>
        </CenterPanel>
        <Row className="footer"></Row>
      </Col>
    );
  }
}

export default Page;
