import React, { Component } from 'react';
import './Home.css';

import Page from '../Page/Page';
import { Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';


interface HomeState { }


interface HomeProps { }


class Home extends Component<HomeProps, HomeState> {
  render() {
    return (
      <Page>
        <Jumbotron style={{ paddingBottom: '10px' }}>
          <h1>Welcome to <b>GitHubble</b>!</h1>
          <br />
          <br />
          <p><i>Read below for more information or click on either of the tabs on the navigation bar to get started!</i></p>
        </Jumbotron>
        <div className="indent-p">
          <h3>About</h3>
          <hr />
          <p>GitHubble allows you to compare your GitHub profile to a sample of 300 other GitHub profiles, or a sample of your choosing.</p>
          <br />
          <Link to="/profile"><h3>Profile</h3></Link>
          <hr />
          <p>View your profile's statistics and projects in an easy-to-digest format. You can also choose a different profile to inspect, which will be remembered and used instead when comparing profiles.</p>
          <Link to="/compare"><h3>Compare</h3></Link>
          <hr />
          <p>Compare your projects and statistics to other GitHub users, or compare it to a group of 300 profiles stored in our database to get a sense of how your experience compares to those of other developers!</p>
        </div>
      </Page>
    );
  }
}

export default Home;