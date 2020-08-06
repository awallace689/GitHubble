import React, { Component } from 'react';
import './Call.css';
import fetch from 'node-fetch';

// import 'react-json-pretty/themes/monikai.css'
import JSONPretty from 'react-json-pretty';


interface InfoPanelState { }


interface InfoPanelProps {
  username: string,
  info: any,
  loading: boolean,
  errorMsg: string
}


class InfoPanel extends Component<InfoPanelProps, InfoPanelState> {
  // constructor(props: CallProps) {
  //   super(props);
  // }

  render() {
    let elem = this.props.info === this.props.errorMsg
      ? <i style={{ color: 'Red' }}>{this.props.errorMsg}</i>
      : <JSONPretty className="call" data={this.props.info}></JSONPretty>
    
    return (
      <div className="rounded">
        {this.props.loading
          ? <i>Loading...</i>
          : elem
        }
      </div>
    );
  }
}

export default InfoPanel;