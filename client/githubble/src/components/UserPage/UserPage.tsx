import React, { Component, ChangeEvent } from 'react';
import './UserPage.css';
import { Col, Row, Navbar, Button, InputGroup, FormControl } from 'react-bootstrap';
import InfoPanel from '../InfoPanel/InfoPanel';
import fetch from 'node-fetch'
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Page from '../Page/Page';


interface UserPageState {
  gotUser: boolean,
  response: any,
  awaitingResponse: boolean,
  error: boolean,
  inputUsername: string,
  madeInitRequest: boolean
}


interface UserPageProps extends RouteComponentProps {
  token: string,
  username: string,
  updateUser: Function,
}


class UserPage extends Component<UserPageProps, UserPageState> {
  errorMsg = "Error fetching user.";
  loadingMsg = "Loading...";

  constructor(props: UserPageProps) {
    super(props);
    this.props.updateUser(window.location.href.split('/').splice(-1)[0])

    this.state = {
      inputUsername: "",
      gotUser: false,
      response: undefined,
      error: false,
      awaitingResponse: false,
      madeInitRequest: false
    };

    this.getUser = this.getUser.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.userInputSubmit = this.userInputSubmit.bind(this);
  }

  componentDidMount() {


    if (!this.state.madeInitRequest) {
      this.getUser();
    }
  }

  shouldComponentUpdate(nextProps: UserPageProps, nextState: UserPageState) {
    if (this.props.username !== window.location.href.split('/').splice(-1)[0]) {
      this.props.updateUser(window.location.href.split('/').splice(-1)[0], this.getUser);
    }

    return !(nextProps === this.props && nextState === this.state)
  }

  getUser(): void {
    this.setState({
      awaitingResponse: true,
      error: false,
      gotUser: false,
      response: undefined,
      madeInitRequest: true
    });

    fetch(
      'http://localhost:8000/api/github/infopanel/' + this.props.username,
      {
        method: 'POST',
        body: JSON.stringify({ token: this.props.token }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(resp => {
        if (resp.status !== 200) {
          throw new Error("Request failed.")
        }
        return resp.json()
      })
      .then(json => this.setState({ response: json.data, gotUser: true }))
      .catch((err) => this.setState({ awaitingResponse: false, error: true, gotUser: false }));
  }

  render() {
    return (
      <Page>
        <Row>
          <Col>
            <label>GitHub User:</label>
            <InputGroup size='sm'>
              <FormControl
                value={this.state.inputUsername}
                placeholder="Username"
                aria-label="Username"
                onChange={this.updateUsername}
              />
              <InputGroup.Append>
                {!this.state.inputUsername
                  ? <Button
                    variant="outline-secondary"
                    disabled>
                    Get
                </Button>
                  : <Button
                    variant="outline-secondary"
                    onClick={this.userInputSubmit}>
                    Get
                </Button>}
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
            {this.state.awaitingResponse && !this.state.gotUser
              ? <i>{this.loadingMsg}</i>
              : null}
          </Col>
        </Row>
      </Page>
    );
  }

  updateUsername(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ inputUsername: e.target.value });
  }

  userInputSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    this.props.history.push(`/profile/${this.state.inputUsername}`);
    this.setState({ gotUser: false });
    this.props.updateUser(this.state.inputUsername, this.getUser);
  }
}


export default withRouter(UserPage);
