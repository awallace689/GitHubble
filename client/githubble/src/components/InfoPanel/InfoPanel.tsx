import React, { Component } from 'react';
import { Col, Button, Accordion, Card, Row, ListGroup } from 'react-bootstrap';
import UserPanel from '../UserPanel/UserPanel';
import moment from 'moment';
import './InfoPanel.css';


interface InfoPanelState { }


interface InfoPanelProps {
  data: any,
}


class InfoPanel extends Component<InfoPanelProps, InfoPanelState> {
  momentFormatString = "MMMM Do YYYY"

  render() {
    console.log(this.props.data)

    /*
     * createdAt
     * pushedAt
     * description
     * isEmpty
     * languages.nodes[].name
     * languages.nodes[].color
     * name
     * url
     * object.history.totalCount
     * object.history.nodes[..2].abbreviatedOid
     * object.history.nodes[].authoredDate
     * object.history.nodes[].deletions
     * object.history.nodes[].additions
     * object.history.nodes[].message
     */
    const repos = (
      <ListGroup>
        {this.props.data.user.repositories.nodes.map((repo: any, i: number) => {
          return (
            <>
              <Row className='repo-body' key={i}>
                <Col xs={12} sm={6}>
                  <a href={repo.url}>
                    <h3>{repo.name}</h3>
                  </a>
                  {repo.description ? <h6 className="accent-two-background rounded p-1">{repo.description}</h6> : null}
                  <h6><b>Created: </b>{moment(repo.createdAt).format(this.momentFormatString)}</h6>
                  <h6><b>Last Updated: </b>{moment(repo.pushedAt).format(this.momentFormatString)}</h6>
                </Col>
                <Col xs={12} sm={3}></Col>
                <Col xs={12} sm={3}></Col>
              </Row>
              <Row><Col>{i == this.props.data.user.repositories.nodes.length - 1 ? null : <hr />}</Col></Row>
            </>
          );
        })}
      </ListGroup>
    );

    const accordionContents = [
      { title: "Statistics", body: <Card.Body>Text1</Card.Body> },
      {
        title: "Projects", body:
          <Card.Body>
            {repos}
          </Card.Body>
      }
    ];

    return (
      <>
        <UserPanel data={this.props.data} />
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