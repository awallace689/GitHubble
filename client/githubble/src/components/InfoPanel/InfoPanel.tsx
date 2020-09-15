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

  /* Determine if background color requires light or dark text color.
   *
   * Modified from the following: 
   *   https://stackoverflow.com/a/41491220
   */
  determineColor(bgColor: string, lightColor: string, darkColor: string) {
    bgColor = bgColor ? bgColor : '#000000';
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
  }

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
            <div key={i}>
              <Row className='repo-body'>
                <Col xs={12} sm={6}>
                  <a href={repo.url}>
                    <h3>{repo.name}</h3>
                  </a>
                  {repo.description ? <h6 className="accent-two-background rounded p-1">{repo.description}</h6> : null}
                  <Row style={{ paddingLeft: '12px' }} className="w-100">
                    {repo.languages.nodes.map((lang: { name: string, color: string }, i: number) => (
                      <h6
                        key={i}
                        className="ml-1 mr-1 p-1 rounded"
                        style={{
                          backgroundColor: lang.color ? lang.color : '#000000',
                          color: this.determineColor(lang.color, 'white', 'black')
                        }}>
                        {lang.name}
                      </h6>
                    ))}
                  </Row>
                </Col>
                <Col xs={12} sm={6}>
                  <h6><b>Created: </b>{moment(repo.createdAt).format(this.momentFormatString)}</h6>
                  <h6><b>Last Updated: </b>{moment(repo.pushedAt).format(this.momentFormatString)}</h6>
                  <h6 style={{ marginTop: '2rem', textOverflow: 'ellipses', overflowX: 'hidden' }}>
                    <b>Last Commit: </b>
                    {repo.object && repo.object.history.nodes.length
                      ? repo.object.history.nodes[0].message
                      : <i>n/a</i>}
                  </h6>
                </Col>
              </Row>
              <Row><Col>{i == this.props.data.user.repositories.nodes.length - 1 ? null : <hr />}</Col></Row>
            </div>
          );
        })}
      </ListGroup>
    );

    const accordionContents = [
      // { title: "Statistics", body: <Card.Body>Text1</Card.Body> },
      {
        title: `Projects (${this.props.data.user.repositories.nodes.length})`,
        body: <Card.Body>{repos}</Card.Body>
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