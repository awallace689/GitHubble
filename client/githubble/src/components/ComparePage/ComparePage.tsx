import React, { Component } from 'react';
import './ComparePage.css';

import Page from '../Page/Page';
import fetch from 'node-fetch';
import { Col, Row } from 'react-bootstrap';


interface ComparePageState {
  sample: Array<any> | null,
}


interface ComparePageProps {
  token: string,
  username: string,
  updateUser: Function,
}


class ComparePage extends Component<ComparePageProps, ComparePageState> {
  constructor(props: ComparePageProps) {
    super(props);
    this.state = {
      sample: null
    }
  }

  async componentDidMount() { 
    fetch('http://localhost:8000/api/github/')
  }
  
  render() {
    return (
      <Page>
        <Row>
          <Col>
            <p>Whaddup!</p>         
          </Col>
        </Row>
      </Page>
    );
  }
}

export default ComparePage;