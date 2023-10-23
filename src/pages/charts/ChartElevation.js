import React from "react";
// import { icon } from "leaflet";

// const brandSuccess = getStyle("success") || "#4dbd74";
// const brandInfo = getStyle("info") || "#20a8d8";
// const brandDanger = getStyle("danger") || "#f86c6b";

class ChartElevation extends React.Component {
  state = {
    defaultOptions: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
      elements: {
        point: {
          radius: 2,
          hitRadius: 4,
          hoverRadius: 2,
          hoverBorderWidth: 3,
        },
      },
    },
  };
  // render
  render() {
    return (
      <div className="section-graph-inmap">
        <button className="btn" onClick={this.props.closeChartElevation}>
          <span className="icon icon-cancel-squared text-danger font-"></span>
        </button>
        <strong>{this.props.title}</strong>
        <hr className="transparent mx-0 my-1" />
        <CChartLine
          datasets={this.props.line}
          options={this.state.defaultOptions}
          labels={this.props.header}
        />
      </div>
    );
  }
}

export default ChartElevation;
