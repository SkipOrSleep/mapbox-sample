import React, { Component } from 'react';
import './top.css';
import logo from '../logo.svg';

export default class Top extends Component {

  getTitle() {
    return '';
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            404 NotFound.
          </p>
          <a　
            className="App-link"
            href="http://localhost:3000/mapbox-sample/"
            target="_self"
            rel="noopener noreferrer"
          >
            Topに戻る
          </a>
        </header>
      </div>
    );
  }
}
