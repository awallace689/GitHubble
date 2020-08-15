import React, { Component } from 'react';
import { Col, Button, Accordion, Card, Row } from 'react-bootstrap';
import './InfoPanel.css';


interface InfoPanelState { }


interface InfoPanelProps {
  data: any,
}


class InfoPanel extends Component<InfoPanelProps, InfoPanelState> {
  render() {
    console.log(this.props.data)
    /*
    * avatarUrl
    * Name
    * url
    * Bio
    * pullRequests.totalCount
    * repositories.totalCount
    * watching.totalCount
    */
    const header = (
      <Card>
        <Card.Body className="w-100 h-100">
          <Row>
            <Col xs={12} sm={4} className="separating-line">
              <Row>
                <img
                  src={this.props.data.user.avatarUrl}
                  alt="profile"
                  className="profile-img" />
                <a className="align-self-center m-3" href={this.props.data.user.url}>
                  <h4 >{this.props.data.user.name}</h4>
                </a>
                {this.props.data.user.bio
                  ? <p className="rounded mt-3 mr-3 p-2 accent-two-background">
                    {this.props.data.user.bio}
                  </p>
                  : null}
              </Row>
            </Col>
            <Col xs={12} sm={4} className="separating-line">

            </Col>
          </Row>
        </Card.Body>
      </Card>
    );

    const accordionContents = [
      { title: "Statistics", body: <Card.Body>Text1</Card.Body> },
      { title: "Projects", body: <Card.Body>Text2</Card.Body> }
    ];

    return (
      <>
        {header}
        <Accordion>
          {accordionContents.map((item: { title: string, body: JSX.Element }, i) => {
            const key = i.toString();
            return (
              <Card key={key}>
                <Accordion.Toggle className="accent-two-background" as={Card.Header} eventKey={key}>
                  {item.title}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={key}>
                  {item.body}
                </Accordion.Collapse>
              </Card>
            );
          })}
        </Accordion>
      </>
    );
  }
}

export default InfoPanel;