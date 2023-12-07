import React from 'react'
import { Column } from '@ant-design/plots'
import { Empty } from 'antd'

function HeaderColumnChart({ dataChart, xField, yField, seriesField }) {
  if (!dataChart.length) {
    return (
      <div className='quantity-show__chart-empty'>
        <Empty description='No campaigns' />
      </div>
    )
  }

  return (
    <div className='quantity-show__chart'>
      <Column
        style={{ width: '100%' }}
        data={dataChart}
        isGroup={true}
        xField={xField}
        yField={yField}
        seriesField={seriesField}
        color={['#41824C', '#77DC8D']}
        height={186}
        xAxis={{
          tickLine: null,
          label: {
            style: {
              fontFamily: 'Montserrat-Regular',
              fontWeight: 400,
              fill: '#000',
            },
          },
        }}
        yAxis={false}
        columnStyle={{ radius: [4, 4, 0, 0] }}
        legend={{ position: 'top', marker: { symbol: 'circle' }, reversed: true }}
      />
    </div>
  )
}

export default HeaderColumnChart
