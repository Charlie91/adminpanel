import React, { Component } from 'react';
import './App.scss';
import Form from './form/Form.js';


class App extends Component {
  render() {
    return (
      <div className="App">
        <h2>Модуль Reports</h2>
        <Form/>
      </div>
    );
  }
}

export default App;
