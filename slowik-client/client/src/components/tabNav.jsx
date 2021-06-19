import React, { Component } from "react";
import "./tabNav.css";

class TabNav extends Component {
  render() {
    return (
      <div className="tab-nav">
        <ul className="nav nav-tabs">
          {this.props.tabs.map((tab) => {
            const active = tab === this.props.selected ? "selected" : "";
            return (
              <li key={tab}>
                <div
                  className={"tab-nav-item " + active}
                  onClick={() => this.props.setSelected(tab)}
                  key={tab}
                >
                  {tab}
                </div>
              </li>
            );
          })}
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export default TabNav;
