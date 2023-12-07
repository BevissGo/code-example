import React from 'react'
import Chart from 'react-chartjs-2'

const TwoAxiesChart = ({ labels, suggestedMax1 = 0, suggestedMax2 = 0, datasets }) => {
  const data = {
    labels: labels,
    datasets: [{
      type: 'line',
      ...datasets.line,
    },],
  }

  const options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          suggestedMax: suggestedMax1,
          suggestedMin: 0,
        },
        position: 'left',
        gridLines: {
          borderDash: [8, 4],
        },
      }, {
        display: true,
        ticks: {
          display: true,
          suggestedMax: suggestedMax2,
        },
        position: 'right',
        gridLines: {
          display: false,
        }
      }],
      xAxes: [{
        gridLines: {
          display: false,
        }
      }]
    }
  }

  return (
    <Chart type='bar' data={data} options={options} />
  )
}

export default TwoAxiesChart