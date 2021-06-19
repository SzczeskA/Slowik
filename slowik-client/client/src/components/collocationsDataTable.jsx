import React, { Component } from "react";
import DataTable from "react-data-table-component";

class CollocationsDataTable extends Component {
  state = {};
  render() {
    const columns = [
      {
        name: "Word",
        selector: "word",
        sortable: true,
        width: "25%",
        allowOverflow: false,
      },
      {
        name: "Lexem",
        selector: "lexem",
        sortable: true,
        width: "25%",
        allowOverflow: false,
      },
      {
        name: "Part of speech",
        selector: "cTag",
        sortable: true,
        width: "50%",
        allowOverflow: false,
      },
    ];
    return (
      <React.Fragment>
        <DataTable
          title={this.props.title}
          columns={columns}
          data={this.props.colocations}
          highlightOnHover
          fixedHeader
          fixedHeaderScrollHeight="300px"
        ></DataTable>
      </React.Fragment>
    );
  }
}

export default React.memo(CollocationsDataTable);
