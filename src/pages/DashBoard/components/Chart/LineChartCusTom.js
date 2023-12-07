import React, { useEffect } from 'react'
import { Line, Chart } from 'react-chartjs-2'

import dImage from 'assets/images/icons/charts/d.png'
import iImage from 'assets/images/icons/charts/i.png'
import sImage from 'assets/images/icons/charts/s.png'
import cImage from 'assets/images/icons/charts/c.png'

import './style.scss'

const LineChartCustom = ({ dataChart }) => {
  const chartRef = React.createRef()
  const images = [dImage, iImage, sImage, cImage]

  useEffect(() => {
    Chart.pluginService.register({
      beforeDraw: (chart) => {
        const myChartRef = chart.ctx

        //generate label xAxis
        const xAxis = chart.scales['x-axis-0']
        const yAxis = chart.scales['y-axis-left']
        if(xAxis) {
          xAxis.ticks.forEach((value, index) => {
            const x = xAxis.getPixelForTick(index)
            const image = new Image()
  
            image.src = images[index]
            image.style.width = 0
            image.style.height = 0
            image.onload = () => {
              image.style.width = 0
              image.style.height = 0
            }
            myChartRef.drawImage(image, x - 10, yAxis?.bottom + 20, 25, 25)
          })
        }

        //generate label yAxis
        const yAxisRight = chart.scales['y-axis-right']
        if( yAxisRight ) {
          yAxisRight.ticks.forEach((value, index) => {
            const y1 = yAxisRight.getPixelForTick(index - 1)
            const y2 = yAxisRight.getPixelForTick(index)
            const x = xAxis.getPixelForTick(3)
  
            myChartRef.font = '10px ProximaNova-Regular'
            myChartRef.fillStyle = '#454545'
            if (index !== 0) {
              myChartRef.fillText(9 - index, x + 22, (y1 + y2) / 2 + 7)
            }
          })
        }

        //Get coordinates
        const xMin = xAxis?.getPixelForTick(0)
        const xMax = xAxis?.getPixelForTick(3)
        const yMax = yAxisRight?.getPixelForTick(0)
        // const yMiddle = yAxisRight?.getPixelForTick(4)
        const yMin = yAxisRight?.getPixelForTick(8)

        // draw line top of chart
        myChartRef.strokeStyle = '#c6c6c6'
        myChartRef.lineWidth = 1.5
        myChartRef.beginPath()
        myChartRef.moveTo(xMin, yMax)
        myChartRef.lineTo(xMax, yMax)
        myChartRef.stroke()

        // draw line middle of chart
        // myChartRef.strokeStyle = '#c6c6c6'
        // myChartRef.lineWidth = 1.5
        // myChartRef.beginPath()
        // myChartRef.moveTo(xMin, yMiddle)
        // myChartRef.lineTo(xMax, yMiddle)
        // myChartRef.stroke()

        // draw line left of chart
        myChartRef.strokeStyle = '#c6c6c6'
        myChartRef.lineWidth = 1.5
        myChartRef.beginPath()
        myChartRef.moveTo(xMin, yMax)
        myChartRef.lineTo(xMin, yMin)
        myChartRef.stroke()
      },
    })
  }, [chartRef, images])

  const data = {
    labels: ['', '', '', ''],
    datasets: [
      {
        data: dataChart,
        pointBackgroundColor: '#c9dce3',
        pointBorderColor: '#004059',
        pointRadius: 5,
        pointHoverBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#c9dce3',
        yAxisID: 'y-axis-left',
      },
    ],
  }

  const options = {
    responsive: true,
    layout: {
      padding: {
        left: 0,
        right: 40,
        bottom: 40,
      },
    },
    tooltips: {
      mode: 'none',
    },
    elements: {
      // color line
      line: {
        fill: false,
        borderColor: '#004059',
        tension: '0',
        borderWidth: '1',
      },
    },
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          id: 'y-axis-left',
          gridLines: {
            color: '#c6c6c6',
            borderDash: [7, 5],
            lineWidth: 1,
            drawTicks: false,
            zeroLineColor: '#c6c6c6',
          },
          position: 'left',
          ticks: {
            max: 24,
            min: 0,
            // beginAtZero: false,
            stepSize: 3,
            fontSize: 10,
            fontFamily: 'ProximaNova-Regular',
            fontColor: '#454545',
            padding: 22,
          },
        },
        {
          id: 'y-axis-right',
          position: 'right',
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
            max: 8,
            min: 0,
            stepSize: 1,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawTicks: false,
            color: '#c6c6c6',
            lineWidth: 1.5,
            zeroLineColor: '#c6c6c6',
          },
          ticks: {
            // beginAtZero: true,
          },
        },
      ],
    },
  }

  return (
    <div style={containerStyle}>
      <Line data={data} ref={chartRef} options={options} height={220} />
    </div>
  )
}

const containerStyle = {
  margin: '36px 0px'
}

export default LineChartCustom
