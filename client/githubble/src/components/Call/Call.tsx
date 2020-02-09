import React, { Component } from 'react';
import './Call.css';
import fetch from 'node-fetch';

// import 'react-json-pretty/themes/monikai.css'
import JSONPretty from 'react-json-pretty';


interface State {
  complete: boolean;
  response: any;
}

class Call extends Component<object, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      complete: false,
      response: undefined
    };
  }

  componentDidMount(): void {
    fetch('http://localhost:8000/profile/awallace689')
      .then(resp => resp.json())
      .then(json => this.setState({
        complete: true,
        response: json
      }))
      .catch(() => this.setState({
        complete: true,
        response: "Request failed."
      }))
  }

  render() {
    return (
      <div className="call rounded">
        {this.state.complete
          ? <JSONPretty data={this.state.response}></JSONPretty>
          : 'Loading...'
        }
      </div>
    );
  }
}

export default Call;