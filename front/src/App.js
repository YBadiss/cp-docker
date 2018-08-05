import React, { Component } from 'react';
import './App.css';

import Hello from './Hello.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Loyalty program</h1>
        <Hello name="Robert" id="42"/>
      </div>
    );
  }
}

export default App;
