import React, { Component } from "react";
import "./occurencesTab.css";
import DataTable from "react-data-table-component";
import { Chart } from "react-google-charts";

class OccurencesTab extends Component {
  state = {
    word: "",
  };

  componentDidMount() {
    this.setState({ word: this.props.word });
  }

  getTotalOccurences() {
    let total = 0;

    for (let i = 0; i < this.props.occurences.length; i++) {
      total += this.props.occurences[i].count;
    }
    return total;
  }

  formatChartData() {
    let chartData = this.props.occurences.map((el) => Object.values(el));
    chartData.sort(function (a, b) {
      return b[1] - a[1];
    });
    let slicedChartData = chartData.slice(0, 10);
    slicedChartData.unshift(["Text File", "Occurences"]);

    return slicedChartData;
  }

  render() {
    return (
      <div className="occurences-tab">
        <p className="occurences-header">
          Occurences of the word "{this.state.word}"
        </p>
        <p className="total-occurences">
          Total occurences: {this.getTotalOccurences()}
        </p>
        <div className="data-presentation">
          <div className="occurences-table">{this.renderTable()}</div>
          <div>{this.renderChart()}</div>
        </div>
      </div>
    );
  }

  renderTable() {
    const columns = [
      {
        name: "Text file",
        selector: "fileName",
        sortable: true,
        width: "70%",
        allowOverflow: false,
      },
      {
        name: "Count",
        selector: "count",
        center: true,
        sortable: true,
        allowOverflow: false,
      },
    ];

    return (
      <React.Fragment>
        <DataTable
          title="Occurences in individual files"
          columns={columns}
          data={this.props.occurences}
          highlightOnHover
          fixedHeader
          fixedHeaderScrollHeight="300px"
        ></DataTable>
      </React.Fragment>
    );
  }

  renderChart() {
    return (
      <React.Fragment>
        <Chart
          width={"600px"}
          height={"410px"}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={this.formatChartData()}
          options={{
            title: "Files with largest occurence count",
            chartArea: { width: "40%", left: "40%" },
            hAxis: {
              title: "Occurences",
              minValue: 0,
            },
            vAxis: {
              title: "Text File",
            },
            legend: { position: "none" },
            bar: { groupWidth: "90%" },
          }}
        ></Chart>
      </React.Fragment>
    );
  }
}

export default OccurencesTab;
