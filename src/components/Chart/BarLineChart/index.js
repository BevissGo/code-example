import React from 'react'
import Chart from 'react-chartjs-2'

const BarLineChart = ({ labels, suggestedMax = 0, datasets }) => {
  const data = {
    labels: labels,
    datasets: [{
      type: 'line',
      ...datasets?.line,
    }, {
      type: 'bar',
      ...datasets?.bar,
    }],
  }

  const options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          suggestedMax: suggestedMax,
        },
        gridLines: {
          borderDash: [8, 4],
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

export default BarLineChart