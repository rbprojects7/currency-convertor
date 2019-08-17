import React, { Component, Fragment } from 'react';
import { Line } from 'react-chartjs-2';
import { isEmpty, map } from 'lodash';
import { inject, observer } from "mobx-react";
import { toJS } from 'mobx';

const data = {
  labels: [],
  datasets: [
    {
      label: 'Exchange Rate',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    }
  ]
};

@inject('appstate')
@observer
class LineChart extends Component {
  constructor(props) {
    super(props);
    const { currencyA, currencyB } = props;
    this.state = { data, currencyA, currencyB };
  }
  componentWillReceiveProps(nextProps) {
    const { currencyA, currencyB } = nextProps;
    this.setState({ currencyA, currencyB });
  }
  getData = (currencyData, datesAxis, currencyA, currencyB) => {
    let { data } = this.state;
    const datasets = data.datasets[0];
    const currencyArr = [];
    map(currencyData, unit => currencyArr.push(Number(Number(unit[currencyB]) / Number(unit[currencyA])).toFixed(4)));
    datasets.data = currencyArr;
    data.datasets[0] = datasets;
    data.labels = datesAxis;
    return data;
  };
  render() {
    const { appstate } = this.props;
    const { data, currencyA, currencyB } = this.state;
    return (
      <Fragment>
        {!isEmpty(toJS(appstate.historicalData)) && !isEmpty(toJS(appstate.historicalDates)) && (<Line data={this.getData(appstate.historicalData, appstate.historicalDates, currencyA, currencyB)} />)}
      </Fragment>
    );
  }
}

export default LineChart;
