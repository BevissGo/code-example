import React from 'react'
import { Dropdown, Menu } from 'antd'
import _ from 'lodash'
import { DownArrow } from '../Positions/res/icons'
import './style.scss'

const colors = [
  'rgb(244,101,101)',
  'rgb(247,130,129)',
  'rgb(248,154,153)',
  'rgb(250,165,165)',
  'rgb(251,178,177)',
  'rgb(251,190,190)',
  'rgb(251,190,190)',
  'rgb(251,245,232)',
  'rgb(252,248,240)',
]

const ProgressBar = ({ title, percent, max, backgroundColor,  }) => {
  const percentWidth = (percent / max) * 100
  return (
    <div className='progress'>
      <div style={{ width: `${percentWidth}%`, backgroundColor }} className='progress__bar'>
        <div className='bar__title' >{title}</div>
      </div>
    </div>
  )
}


const BarChart = ({ dataChart, contentPage = {} }) => {

  const [sort, setSort] = React.useState('desc')

  const onSort = (type) => {
    setSort(type)
  }

  const dataMemo = React.useMemo(() => {
    return dataChart.sort(( a, b ) => {
      if(sort === 'desc'){
        return b.count - a.count
      }
      return a.count - b.count
    })
  },[sort, dataChart])

  const maxCount = _.maxBy(dataChart, 'count')
  const minCount = _.minBy(dataChart, 'count')
  const secondMinCount = _.minBy(dataChart.filter(item => item.count !== minCount.count), 'count')

  const dropDownSort = (
    <Menu>
      <Menu.Item key='0'>
        <a onClick={()=> onSort('asc')}>{contentPage.ascendant}</a>
      </Menu.Item>
      <Menu.Item key='1'>
        <a onClick={()=> onSort('desc')}>{contentPage.descendant}</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className='line-chart-dashboard'>

      <p className='line-chart-dashboard__title'
        style={{ display: 'flex', justifyContent:'space-between', alignItems:'center' }}>
        {contentPage.numberOfCandidates}
        <Dropdown placement='bottomRight'  overlay={dropDownSort} trigger={['click']}>
          <a className='ant-dropdown-link' >
            <DownArrow/>
          </a>
        </Dropdown>
      </p>
      {dataMemo.slice(0,8).map((item, i) => {
        const backgroundColor = colors[i]
        const color = (maxCount?.count > secondMinCount?.count && item?.count > secondMinCount?.count) ? '#ffffff' : '#000000'
        return(
        <div key={i.toString()}>
          <ProgressBar
            backgroundColor={backgroundColor}
            max={maxCount.count}
            title={item.name}
            percent={item.count}
            color={color}
          />
        </div>
      )})}

    </div>
  )
}

export default BarChart
