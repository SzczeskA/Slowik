import React from "react";
import "../App.css";
import AppHeader from "../components/appHeader";
import TabNav from "../components/tabNav";
import Tab from "../components/tab";
import GetByIdTab from "../components/getByIdTab";
import LoadFilesTab from "../components/loadFilesTab";

class StartingPage extends React.Component {
  state = {
    tabs: ["Load files", "Get by ID"],
    selected: "Load files",
  };

  setSelected = (tab) => {
    this.setState({ selected: tab });
  };

  render() {
    return (
      <React.Fragment>
        <AppHeader />
        <div className="spacing-div"></div>
        <TabNav
          tabs={this.state.tabs}
          selected={this.state.selected}
          setSelected={this.setSelected}
        >
          <Tab tabStyle="tab" isSelected={this.state.selected === "Load files"}>
            <LoadFilesTab />
          </Tab>
          <Tab tabStyle="tab" isSelected={this.state.selected === "Get by ID"}>
            <GetByIdTab />
          </Tab>
        </TabNav>
      </React.Fragment>
    );
  }
}

export default StartingPage;
