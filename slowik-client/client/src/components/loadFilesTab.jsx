import React, { Component } from "react";
import ReactLoading from "react-loading";
import AxiosClient from "./axiosClient";
import { withRouter } from "react-router-dom";
import "./loadFilesTab.css";

class LoadFilesTab extends Component {
  state = {
    corpusId: "",
    email: "",
    isEmailIncorrect: false,
    isFileIncorrect: false,
    stage: "Loading",
  };

  setStage = (currentStage) => {
    this.setState({ stage: currentStage });
  };

  handleGoBack = () => {
    this.setState({ isFileIncorrect: false });
    this.setStage("Loading");
  };

  handleUpload = () => {
    let fileInput = document.getElementById("fileInput");
    let fileIncorrect = false;
    let emailIncorret = false;

    if (this.checkEmail(this.state.email))
      this.setState({ isEmailIncorrect: false });
    else {
      this.setState({ isEmailIncorrect: true });
      emailIncorret = true;
    }
    if (fileInput.files.length !== 0 && this.checkFile(fileInput.files[0].name))
      this.setState({ isFileIncorrect: false });
    else {
      this.setState({ isFileIncorrect: true });
      fileIncorrect = true;
    }
    if (!emailIncorret && !fileIncorrect) {
      this.ulpoadToServer();
      this.setStage("Processing");
    }
  };

  checkFile(file) {
    var extension = file.substr(file.lastIndexOf(".") + 1);
    if (!/(zip)$/gi.test(extension)) {
      return false;
    }
    return true;
  }

  ulpoadToServer() {
    let fileInput = document.getElementById("fileInput");
    const formData = new FormData();
    formData.append("zipFile", fileInput.files[0]);
    AxiosClient.post("/Corpuses?email=" + this.state.email, formData).then(
      (res) => {
        if (this.state.stage === "Processing") {
          if (res.status === 200) {
            this.setState({ corpusId: res.data });
            this.setStage("Processed");
          } else if (res.status === 400) {
            this.setStage("BadZip");
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  copyCodeToClipboard = () => {
    const el = this.textArea;
    el.select();
    document.execCommand("copy");
  };

  handleResults = () => {
    this.props.history.push("/results/" + this.state.corpusId);
  };

  render() {
    if (this.state.stage === "Loading") {
      return (
        <div className="tab-content">
          <p className="header-text">Select files you want to upload</p>
          <p className="body-text">
            Select a ZIP file containing a corpus you want to process. The
            corpus must consist of text files in the following formats: pdf,
            txt, doc, docx, rtf. Processing your files may take a while. Please
            submit your e-mail so we can notify you when we're done.
          </p>
          <form className="corpus-form">
            <div>
              <input
                className="form-control w-75"
                type="file"
                id="fileInput"
              ></input>
              <div className="error-span">{this.renderFileError()}</div>
            </div>
            <div>
              <label className="email-label">Submit your e-mail:</label>
              <input
                className="form-control w-75"
                type="email"
                placeholder="example@example.com"
                onChange={(e) => this.setState({ email: e.target.value })}
              ></input>
              <div className="error-span">{this.renderEmailError()}</div>
            </div>
            <button
              type="button"
              className="blue-button upload-button"
              onClick={() => {
                this.handleUpload();
              }}
            >
              Upload
            </button>
          </form>
        </div>
      );
    }

    if (this.state.stage === "Processing") {
      return (
        <div className="tab-content">
          <p className="header-text">We are processing your files</p>
          <p className="body-text">
            Processing your files may take from a few seconds to a few hours
            depending on the size of your corpus. We'll notify you and send an
            ID of your corpus to the submitted e-mail address.
          </p>
          <ReactLoading
            type="bars"
            color="#576490"
            height={"100px"}
            width={"100px"}
            className="loading-animation"
          />
          <div
            className="blue-button load-another-button"
            onClick={() => {
              this.setStage("Loading");
            }}
          >
            Load another corpus
          </div>
        </div>
      );
    }

    if (this.state.stage === "Processed") {
      return (
        <React.Fragment>
          <p className="header-text">Your corpus has been processed</p>
          <p className="corpus-processed-text">
            We've managed to successfully process your files. You can proceed
            further or save your corpus ID for future use
          </p>
          <div className="id-display">
            <textarea
              ref={(textarea) => (this.textArea = textarea)}
              className="id-text-area"
              rows="1"
              cols="50"
              readOnly={true}
              draggable="false"
              value={this.state.corpusId}
            ></textarea>
            <i
              className="far fa-copy fa-2x copy-button"
              onClick={() => this.copyCodeToClipboard()}
            ></i>
          </div>
          <div className="d-inline-flex justify-content-center w-100 results-button-area">
            <button
              type="button"
              className="blue-button"
              onClick={() => {
                this.handleResults();
              }}
            >
              Results
            </button>
          </div>
        </React.Fragment>
      );
    }
    if (this.state.stage === "BadZip") {
      return (
        <React.Fragment>
          <div className="tab-content">
            <p className="header-text">Incorrect ZIP file</p>
            <p className="body-text">
              It appears that your .zip file contains files with incorrect
              formats. Please make sure that all files in your .zip are in one
              of the following formats: pdf, txt, doc, docx, rtf.
            </p>
            <button
              type="button"
              className="blue-button load-another-button"
              onClick={() => {
                this.handleGoBack();
              }}
            >
              Go back
            </button>
          </div>
        </React.Fragment>
      );
    }
  }

  renderEmailError() {
    if (this.state.isEmailIncorrect) return "Please enter a valid email";
  }

  renderFileError() {
    if (this.state.isFileIncorrect) return "Please upload a .zip file";
  }
}

export default withRouter(LoadFilesTab);
