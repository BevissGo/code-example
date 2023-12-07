import React from 'react'
import Chart from 'react-chartjs-2'

const Doughnut = ({ labels }) => {
  const data = {
    labels: labels,
    datasets: [{
      data: [10, 20],
      backgroundColor: ['#32ADFA', '#BFE2EF'],
    }],
  }

  const options = {
    legend: {
      display: false,
    },
  }

  return (
    <Chart type='doughnut' data={data} options={options} />
  )
}

export default Doughnut