import React, { Component } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import './UserPanel.css'


interface UserPanelProps {
  data: any
}


class UserPanel extends Component<UserPanelProps, any> {
  render() {
    return (
      <Card>
        <Card.Body className="w-100 h-100">
          <Row>
            <Col xs={12} sm={4} className="separating-line">
              <Row>
                <img
                  src={this.props.data.user.avatarUrl}
                  alt="profile"
                  className="profile-img mr-3" />
                <a className="align-self-center mt-username" href={this.props.data.user.url}>
                  <h4 >{this.props.data.user.name}</h4>
                </a>
                {this.props.data.user.bio
                  ? <p className="rounded mt-3 mr-3 p-2 accent-two-background">
                    <i>{this.props.data.user.bio}</i>
                  </p>
                  : null}
              </Row>
            </Col>
            <Col xs={12} sm={4} className="separating-line">
              <h5 className="mt-1">Activity:</h5>
              <div className="header-stats flex-column justify-content-around">
                <p><b>Pull requests:</b> {this.props.data.user.pullRequests.totalCount}</p>
                <p><b>Repositories:</b> {this.props.data.user.repositories.totalCount}</p>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <h5 className="mt-1">Social:</h5>
              <div className="header-stats flex-column justify-content-around">
                <p><b>Watching:</b> {this.props.data.user.watching.totalCount}</p>
                <p><b>Followers:</b> {this.props.data.user.followers.totalCount}</p>
                <p><b>Following:</b> {this.props.data.user.following.totalCount}</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default UserPanel;
