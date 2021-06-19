import React, { Component } from "react";
import WordInputBox from "../components/wordInuptBox";
import TabNav from "../components/tabNav";
import Tab from "../components/tab";
import "../App.css";
import "./resultsPage.css";
import ReactLoading from "react-loading";
import AppHeader from "../components/appHeader";
import AxiosClient from "../components/axiosClient";
import OccurencesTab from "../components/occurencesTab";
import CollocationsTab from "../components/collocationsTab";
import partsOfSpeechMap from "../components/cTagToPartOfSpeech";
import WordNotFoundBox from "../components/wordNotFoundBox";

class ResultsPage extends Component {
  constructor(props) {
    super(props);
    this.handleWordChange = this.handleWordChange.bind(this);
    this.handleLeftCheckbox = this.handleLeftCheckbox.bind(this);
    this.handleRightCheckbox = this.handleRightCheckbox.bind(this);
    this.handleLeftRangeChange = this.handleLeftRangeChange.bind(this);
    this.handleRightRangeChange = this.handleRightRangeChange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  state = {
    corpusId: "",
    occurencesFiles: [],
    leftCollocationsFiles: "",
    rightCollocationsFiles: "",
    leftCollocationRange: "1",
    rightCollocationRange: "1",
    leftScope: "Paragraph",
    rightScope: "Paragraph",
    word: "",
    wordNotFound: false,
    isWordInvalid: false,
    tabs: ["Occurences", "Collocations"],
    selected: "Occurences",
    stage: "Start",
  };

  setSelected = (tab) => {
    this.setState({ selected: tab });
  };

  handleWordChange(value) {
    this.setState({ word: value });
  }

  handleAnalyze = () => {
    if (this.state.word === "") this.setState({ isWordInvalid: true });
    else {
      this.setState({ stage: "Loading" });
      this.setState({ isWordInvalid: false });
      this.getDataFromServer();
    }
  };

  onChange = (e) => {
    this.setState({ fieldValue: e.target.value });
  };

  processOccurences(data) {
    let processedData = Object.entries(data).map(([fileName, count]) => ({
      fileName,
      count,
    }));
    return processedData;
  }

  getOccurencesFromServer = () => {
    AxiosClient.get(
      "/corpuses/" +
        this.state.corpusId +
        "/apperances?word=" +
        this.state.word +
        "&groupByFiles=true"
    ).then(
      (res) => {
        if (res.status === 200) {
          let occurences = this.processOccurences(res.data);
          this.setState({ occurencesFiles: occurences });
          this.setState({ stage: "Results" });
        } else if (res.status === 204) {
          this.setState({ stage: "NoWord" });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  processCollocations(data) {
    let processedData = [];
    Object.entries(data).map(function (x) {
      return x[1].collocations.map(function (y) {
        let w = y.orth;
        let l = y.lexems[0].base;
        let c = partsOfSpeechMap[y.lexems[0].cTag.split(":")[0]]
          ? partsOfSpeechMap[y.lexems[0].cTag.split(":")[0]]
          : y.lexems[0].cTag.split(":")[0];
        processedData.push({
          word: w,
          lexem: l,
          cTag: c,
        });
      });
    });
    return processedData;
  }

  getLeftCollocationsFromServer = () => {
    AxiosClient.get(
      "/corpuses/" +
        this.state.corpusId +
        "/collocations?word=" +
        this.state.word +
        "&direction=" +
        "-" +
        this.state.leftCollocationRange +
        "&scope=" +
        this.state.leftScope
    ).then(
      (res) => {
        if (res.status === 200) {
          let leftCollocations = this.processCollocations(res.data);
          this.setState({ leftCollocationsFiles: leftCollocations });
          this.setState({ stage: "Results" });
        } else if (res.status === 204) {
          this.setState({ stage: "NoWord" });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  getRightCollocationsFromServer = () => {
    AxiosClient.get(
      "/Corpuses/" +
        this.state.corpusId +
        "/collocations?word=" +
        this.state.word +
        "&direction=" +
        this.state.rightCollocationRange +
        "&scope=" +
        this.state.rightScope
    ).then(
      (res) => {
        if (res.status === 200) {
          let rightCollocations = this.processCollocations(res.data);
          this.setState({ rightCollocationsFiles: rightCollocations });
          this.setState({ stage: "Results" });
        } else if (res.status === 204) {
          this.setState({ stage: "NoWord" });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  getDataFromServer = () => {
    this.getOccurencesFromServer();
    this.getLeftCollocationsFromServer();
    this.getRightCollocationsFromServer();
  };

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.setState({ corpusId: params.id });
  }

  handleLeftCheckbox(checked) {
    if (checked === true) {
      this.setState({ leftScope: "Sentence" });
    } else if (checked === false) {
      this.setState({ leftScope: "Paragraph" });
    }
  }

  handleRightCheckbox(checked) {
    if (checked === true) {
      this.setState({ rightScope: "Sentence" });
    } else if (checked === false) {
      this.setState({ rightScope: "Paragraph" });
    }
  }

  render() {
    return (
      <React.Fragment>
        <AppHeader />
        <WordInputBox
          onWordChange={this.handleWordChange}
          handleAnalyze={this.handleAnalyze}
          isWordInvalid={this.state.isWordInvalid}
        />
        <div>{this.renderPageContent()}</div>
      </React.Fragment>
    );
  }

  renderPageContent() {
    if (this.state.stage === "Loading")
      return <React.Fragment>{this.renderLoading()}</React.Fragment>;
    if (this.state.stage === "Results")
      return <React.Fragment>{this.renderResults()}</React.Fragment>;
    if (this.state.stage === "NoWord")
      return <WordNotFoundBox></WordNotFoundBox>;
  }

  renderResults() {
    return (
      <TabNav
        tabs={this.state.tabs}
        selected={this.state.selected}
        setSelected={this.setSelected}
      >
        <Tab
          tabStyle="results-tab"
          isSelected={this.state.selected === "Occurences"}
        >
          <OccurencesTab
            word={this.state.word}
            occurences={this.state.occurencesFiles}
          ></OccurencesTab>
        </Tab>
        <Tab
          tabStyle="results-tab"
          isSelected={this.state.selected === "Collocations"}
        >
          <CollocationsTab
            word={this.state.word}
            leftCollocations={this.state.leftCollocationsFiles}
            rightCollocations={this.state.rightCollocationsFiles}
            handleRightCheck={this.handleRightCheckbox}
            handleLeftCheck={this.handleLeftCheckbox}
            updateLeftRange={this.handleLeftRangeChange}
            updateRightRange={this.handleRightRangeChange}
            refresh={this.handleRefresh}
          ></CollocationsTab>
        </Tab>
      </TabNav>
    );
  }

  renderLoading() {
    return (
      <div>
        <ReactLoading
          type="spin"
          color="#576490"
          height={"100px"}
          width={"100px"}
          className="results-loading-animation"
        ></ReactLoading>
      </div>
    );
  }

  handleLeftRangeChange(val) {
    this.setState({ leftCollocationRange: val });
  }

  handleRightRangeChange(val) {
    this.setState({ rightCollocationRange: val });
  }

  handleRefresh() {
    this.getDataFromServer();
    this.renderResults();
  }
}

export default ResultsPage;
