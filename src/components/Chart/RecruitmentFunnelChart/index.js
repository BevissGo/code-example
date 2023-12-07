import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js'

const drawArrow = {
  id: 'drawArrow',
  afterDraw(chart) {
    const { ctx } = chart
    const width = ctx.canvas.width / chart.currentDevicePixelRatio
    const height = ctx.canvas.height / chart.currentDevicePixelRatio
    const fixedHeight = height / 2 - 14
    const data = chart.config.data.datasets[0].data
    const distance = width / 4
    ctx.save()

    for (let i = 0; i < 3; i++) {
      const fixedWidth = (width / 4 - 10) + distance * i
      const percenage = Math.round((data[i + 1] / data[i]) * 100)
      ctx.beginPath()
      ctx.moveTo(fixedWidth, fixedHeight)
      ctx.lineTo(fixedWidth + 30, fixedHeight)
      ctx.lineTo(fixedWidth + 35, fixedHeight + 10)
      ctx.lineTo(fixedWidth + 30, fixedHeight + 20)
      ctx.lineTo(fixedWidth, fixedHeight + 20)
      ctx.lineTo(fixedWidth, fixedHeight)
      ctx.fillStyle = '#C4C4C4'
      ctx.fill()
      ctx.strokeStyle = '#32ADFA'
      ctx.stroke()
      ctx.fillStyle = '#454545'
      ctx.fillText(`${percenage}%`, fixedWidth + 4, height / 2)
    }
  }
}

export const options = {
  responsive: true,
  animation: {
    duration: 1,
    onComplete: function () {
      const chartInstance = this.chart,
        ctx = chartInstance.ctx

      ctx.font = ChartJS.helpers.fontString(
        ChartJS.defaults.global.defaultFontSize,
        ChartJS.defaults.global.defaultFontStyle,
        ChartJS.defaults.global.defaultFontFamily
      )
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'

      this.data.datasets.forEach(function (dataset, i) {
        const meta = chartInstance.controller.getDatasetMeta(i)
        meta.data.forEach(function (bar, index) {
          const data = dataset.data[index]
          ctx.fillText(data, bar._model.x, bar._model.y - 5)
        })
      })
    }
  },
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          display: true,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          callback: (label) => {
            if (/\s/.test(label)) {
              return label.split(' ')
            } else {
              return label
            }
          }
        }
      }
    ],
  },
  events: [],
  plugins: [drawArrow],
  layout: {
    padding: {
      top: 20
    }
  }
}

const RecruitmentFunnelChart = ({ labels, datasets }) => {
  const data = {
    labels,
    datasets: datasets
  }
  return <Bar options={options} data={data} plugins={[drawArrow]} />
}

export default RecruitmentFunnelChart
