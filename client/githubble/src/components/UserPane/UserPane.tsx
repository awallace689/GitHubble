import React, { Component, ChangeEvent } from 'react';
import './UserPane.css';
import { Col, Row, Navbar, Button, InputGroup, FormControl } from 'react-bootstrap';
import InfoPanel from '../InfoPanel/InfoPanel';
import fetch from 'node-fetch'


interface UserPaneState {
  gotUser: boolean,
  response: any,
  requestMade: boolean,
  error: boolean,
  username: string
}


interface UserPaneProps {
  token: string
}


class UserPane extends Component<UserPaneProps, UserPaneState> {
  errorMsg = "Error fetching user.";
  loadingMsg = "Loading...";

  constructor(props: UserPaneProps) {
    super(props);

    this.state = {
      username: "awallace689",
      gotUser: false,
      response: undefined,
      error: false,
      requestMade: false
    };

    this.getUser = this.getUser.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.userInputSubmit = this.userInputSubmit.bind(this);
  }

  getUser(username: string): void {
    this.setState({ requestMade: true, error: false, gotUser: false, response: undefined });
    fetch(
      'http://localhost:8000/api/github/infopanel/' + username,
      {
        method: 'POST',
        body: JSON.stringify({ token: this.props.token }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(resp => {
        if (resp.status !== 200) {
          throw new Error("Request failed.")
        }
        return resp.json()
      })
      .then(json => this.setState({ response: json.data, gotUser: true }))
      .catch((err) => this.setState({ requestMade: false, error: true, gotUser: false }));
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
        {this.state.response && !this.state.error
          ? <div className="mt-2">
            <InfoPanel
              data={this.state.response}
            />
          </div>
          : null}
        {this.state.error
          ? <i style={{ color: 'red' }}>{this.errorMsg}</i>
          : null}
        {this.state.requestMade && !this.state.gotUser
          ? <i>{this.loadingMsg}</i>
          : null}
      </>
    );
  }

  updateUsername(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.target.value });
  }

  userInputSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    this.setState({ gotUser: false });
    this.getUser(this.state.username);
  }
}


export default UserPane;
