/* eslint-disable no-unused-vars */
import React from 'react'
import { Pie} from 'react-chartjs-2'
import { Dropdown, Menu, Row, Col } from 'antd'

import { DownArrow } from '../Positions/res/icons'

import './style.scss'

const PieChart = ({data = [], contentPage = {}}) => {
  // const totalPercent = data.reduce((prev, cur) => +(prev || 0) + (+(cur?.percentage ||0 )), 0)
  return <PieComponent dataChart={data} title={contentPage.pieChart} subTitle={`% ${contentPage.recruitment}`}/>
}

const options = {
  responsive: true,
  layout: {
    padding: {
      top: 20,
      left: 0,
      right: 0,
      bottom: 20,
    },
  },
  legend: {
    display: false,
    position: 'top',
  },
}

const LIST_COLORS =  ['#4F2108', '#804E31', '#E5C47C', '#F4DBA4', '#F0716D', '#F4928F', '#EEC07F', '#454545']

const PieComponent = ({ dataChart = [], title = 'Pie Chart', subTitle= '% Recruitment' }) => {
  const data = {
    labels: (dataChart||[])?.slice(0,8)?.map(item => item?.name),
    datasets: [
      {
        label: '# of Votes',
        data: (dataChart||[])?.slice(0,8)?.map(item => +(item?.percentage || 0)),
        backgroundColor: LIST_COLORS,
        borderColor: LIST_COLORS,
        borderWidth: 1,
      },
      {
        data: []
      },
      {
        data: []
      },
      {
        data: []
      }
    ]
  }


  return (
    <div>
      <div className='line-chart-dashboard'>
        <p className='line-chart-dashboard__title'>
        {title}
        </p>
        <p className='line-chart-dashboard__description'>
          {subTitle}
        </p>
        <Pie options={options} data={data} height={300} />
        <Row gutter={16} >
          {(dataChart||[])?.slice(0,8).map((c,i) => (
            <Col className='gutter-row'  style={{ textAlign: 'center'}} key={i} span={6}>
              <div className='circle-position-color' style={{backgroundColor: LIST_COLORS[i]}}/>
              <div style={{fontSize: '10px'}}>{c?.name}</div>
            </Col>
          ))}
        </Row>
      </div>
      <PieItemComponent dataChart={dataChart}/>
    </div>
  )
}

const PieItemComponent = ({ dataChart = [] }) => {
  const [indexItem, setIndexItem] = React.useState(0)
  const item = dataChart[indexItem] || {}
  const reportsData = Object.keys((item?.reports || {})).map(key => ({label:key, percent: item?.reports[key] }))
  // const totalPercentReport = reportsData.reduce((prev, cur) => +(prev || 0) + (+(cur?.percent || 0 )), 0)

  const dropDownSort = (
    <Menu>
      {dataChart.map((item, i) => (
        <Menu.Item key={i}>
          <a onClick={()=> setIndexItem(i)}>{item?.name}</a>
        </Menu.Item>
      ))}
    </Menu>
  )

  const data = {
    labels: reportsData?.map(val => val.label),
    datasets: [
      {
        label: '# of Votes',
        data: reportsData?.map(val => val.percent),
        backgroundColor: LIST_COLORS,
        borderColor: LIST_COLORS,
        borderWidth: 1,
      },
      {
        data: []
      },
      {
        data: []
      },
      {
        data: []
      }
    ]
  }

  return (
    <div className='line-chart-dashboard' style={{padding: '25px 0px'}}>
      <div style={{ padding: '0px 41px'}}>
        <p className='line-chart-dashboard__title' style={{ display: 'flex', justifyContent:'space-between', alignItems:'center' }}>
          {item.name}
          <Dropdown placement='bottomRight'  overlay={dropDownSort} trigger={['click']}>
            <a className='ant-dropdown-link' >
              <DownArrow/>
            </a>
          </Dropdown>
          </p>
          <p className='line-chart-dashboard__description'>
            % Kết quả DISC
          </p>
        <Pie options={options} data={data} height={300} />
      </div>
      <Row style={{justifyContent: 'center'}}>
        {reportsData.map((c,i) => (
          <Col className='gutter-row'  style={{ textAlign: 'center'}} key={i} span={4}>
            <div className='circle-position-color' style={{backgroundColor: LIST_COLORS[i]}}/>
            <div style={{fontSize: '12px'}}>{c.label === 'Khác' ? c.label : `${c.label}`}</div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default PieChart
