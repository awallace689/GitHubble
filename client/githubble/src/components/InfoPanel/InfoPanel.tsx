import React, { Component } from 'react';
import './InfoPanel.css';

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
      : <JSONPretty className="call rounded mt-1 mb-1" data={this.props.info}></JSONPretty>
    
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