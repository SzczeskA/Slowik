import React, { Component } from "react";
import "./wordNotFoundBox.css";

class WordNotFoundBox extends Component {
  state = {};
  render() {
    return (
      <div className="word-not-found-box">
        <div className="word-not-found-box-content">
          <p className="word-not-found-box-header">Word not found!</p>
          <p className="word-not-found-box-body">
            It appears that the word you are looking for is not present in your
            corpus. Try a different word.
          </p>
        </div>
      </div>
    );
  }
}

export default WordNotFoundBox;
