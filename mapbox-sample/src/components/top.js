import React, { Component } from 'react';
import './top.css';
import logo from '../logo.svg';

import MediaQuery from "react-responsive";

export default class Top extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <MediaQuery query="(min-width: 600px)">
              <p>
                このアプリには、Reactが使われています。
              </p>
            </MediaQuery>
            <MediaQuery query="(max-width: 600px)">
              <p>
                このアプリには、<br />Reactが使われています。
              </p>
            </MediaQuery>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reactについて学ぶ
          </a>
        </header>
      </div>
    );
  }
}
