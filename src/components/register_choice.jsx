import React, { Component } from "react";

export class RegisterChoice extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div>
          {this.props.name}<br />
          <label id="test-label">Just an input</label>
          <input id="test-input" placeholder="tada"/>
          <button className="btn btn-primary">Register</button>
        </div>
      );
    }
}