import React, { Component } from 'react';
import request from 'superagent';

const urlForHello = (name, id) =>
  `http://localhost:8000/api/hello/${name}/${id}`;

class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    request
      .get(urlForHello(this.props.name, this.props.id))
      .then(res => {
        this.setState({
          welcomeMessage: res.body.message
        });
      }, (err) => {
        this.setState({
          error: err.toString()
        });
      });
  }

  render() {
    if (this.state.error) {
      return <p>{this.state.error}</p>;
    }
    if (!this.state.welcomeMessage) {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <p>{this.state.welcomeMessage}</p>
      </div>
    );
  }
}

export default Hello;

