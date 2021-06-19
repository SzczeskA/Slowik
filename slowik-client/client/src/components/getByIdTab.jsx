import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./getByIdTab.css";

class GetByIdTab extends Component {
  state = {
    corpusId: "",
    isIdInvalid: false,
  };

  handleGetId = () => {
    if (!this.validateId()) this.setState({ isIdInvalid: true });
    else this.props.history.push("/results/" + this.state.corpusId);
  };

  validateId() {
    var pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return pattern.test(this.state.corpusId);
  }

  render() {
    return (
      <div>
        <p className="header-text">Enter your corpus ID</p>
        <p className="body-text">Enter an ID of a previously uploaded corpus</p>
        <form>
          <input
            id="idInput"
            className="form-control form-control-lg id-input w-75"
            type="text"
            onChange={(e) => this.setState({ corpusId: e.target.value })}
            placeholder="Enter your corpus ID"
          ></input>
          <div className="error-div">{this.renderIDError()}</div>
          <button
            className="next-button"
            type="button"
            onClick={() => {
              this.handleGetId();
            }}
          >
            Next
          </button>
        </form>
      </div>
    );
  }

  renderIDError() {
    if (this.state.isIdInvalid) return "Please enter a valid ID";
  }
}

export default withRouter(GetByIdTab);
