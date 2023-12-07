import React from 'react'

import './style.scss'

const HorizontalBar = () => {
  /*
      Data format:
      [{
          label: string,
          value: number,
      }, ...]
  */

  let data = []
  for (let i = 0; i < 10; i++) {
    data.push({
      label: `Position ${i}`,
      value: Math.floor(Math.random() * 100)
    })
  }

  data.sort((a, b) => b.value - a.value)
  const maxValue = data[0].value

  for (let i = 0; i < data.length; i++) {
    data[i].width = data[i].value / maxValue
  }

  let barList = []
  for (let i = 0; i < data.length; i++) {
    barList.push((
      <div className='horizontal-bar' key={data[i].label} value={data[i].value}
        style={{ width: data[i].width * 100 + '%', backgroundColor: getColorInGradient(data[i].width) }}>
        <div className={`horizontal-bar__label ${data[i].width < 0.2 ? 'black' : 'white'}`}>{data[i].label}</div>
      </div>
    ))
  }

  return (
    <div className='horizontal-bar__container'>
      {barList}
    </div>
  )
}

export default HorizontalBar

const firstColor = '#FFFFFF'
const secondColor = '#32ADFA'
function getColorInGradient(percent) {
  /*
      Return color in gradient range from firstColor 
      to secondColor based on the passed percent
  */
  let res = '#'
  for (let i = 0; i < 3; i++) {
    let reversePercent = 1 - percent
    let color = Math.floor((parseInt(firstColor.substr(i * 2 + 1, 2), 16) - parseInt(secondColor.substr(i * 2 + 1, 2), 16)) * reversePercent)
    color += parseInt(secondColor.substr(i * 2 + 1, 2), 16)
    res += color.toString(16).length === 1 ? '0' + color.toString(16) : color.toString(16)
  }

  return res
}