import React, { Component, ChangeEvent } from 'react';
import './UserPane.css';
import { Col, Row, Navbar, Button, InputGroup, FormControl } from 'react-bootstrap';
import InfoPanel from '../InfoPanel/InfoPanel';
import fetch from 'node-fetch'

interface UserPaneState {
  gotUser: boolean,
  response: any,
  requestMade: boolean,
  username: string
}


class UserPane extends Component<object, UserPaneState> {
  errorMsg = "Error fetching user."
  loadingMsg = "Loading..."

  constructor(props: object) {
    super(props);

    this.state = {
      username: "awallace689",
      gotUser: false,
      response: undefined,
      requestMade: false
    };

    this.getUser = this.getUser.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.userInputSubmit = this.userInputSubmit.bind(this);
  }

  render() {
    return (
      <>
        <label>GitHub User:</label>
        <InputGroup size='sm'>
          <FormControl
            value={this.state.username}
            placeholder="Username"
            aria-label="Username"
            onChange={this.updateUsername}
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={this.userInputSubmit}>
              Get
            </Button>
          </InputGroup.Append>
        </InputGroup>
        {this.state.requestMade
          ? <div className="mt-2">
            <InfoPanel
              username={this.state.username}
              loading={!this.state.gotUser}
              info={this.state.response}
              errorMsg={this.errorMsg}
            />
          </div>
          : null}
      </>
    );
  }

  getUser(username: string): void {
    this.setState({ requestMade: true });
    fetch('http://localhost:8000/infopanel/' + username)
      .then(resp => resp.json())
      .then(json => this.setState({
        gotUser: true,
        response: json
      }))
      .catch(() => this.setState({
        gotUser: true,
        response: this.errorMsg
      }));
  }

  updateUsername(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.target.value })
  }

  userInputSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    this.setState({ gotUser: false });
    this.getUser(this.state.username);
  }
}


export default UserPane;
