import React from 'react'
import { FallOutlined, LeftOutlined, RightOutlined, RiseOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

import HeaderColumnChart from './components/HeaderColumnChart'

import './style.scss'

function QuantityShow({
  quantity,
  changeRate,
  title,
  timeOption,
  dateDiff,
  bgColor,
  xField,
  yField,
  seriesField,
  dataChart,
  extended = false,
  isLoading = false,
  handleExtend,
}) {
  return (
    <div className={`quantity-show${extended ? '-extended' : ''}`} style={{ backgroundColor: bgColor }}>
      <Spin spinning={isLoading}>
        <div className='quantity-show__header'>
          <p className='quantity-show__title'>{title}</p>
          {timeOption !== 'allTime' && (
            <p className='quantity-show__extend-text' onClick={handleExtend}>
              {extended ? (
                <span>
                  <LeftOutlined /> Less
                </span>
              ) : (
                <span>
                  More <RightOutlined />
                </span>
              )}
            </p>
          )}
        </div>
        <div className='quantity-show__quantity'>{quantity}</div>
        {extended && (
          <HeaderColumnChart dataChart={dataChart} xField={xField} yField={yField} seriesField={seriesField} />
        )}
        {timeOption !== 'allTime' && (
          <div className='quantity-show__changeRate'>
            {changeRate === '--' ? (
              <p>
                <span className='quantity-show__changeRate__percentage'>{changeRate}%</span>
                <span className='quantity-show__changeRate__time'>
                  {timeOption === 'thisWeek' || dateDiff === 6 ? 'Last week' : 'Last month'}
                </span>
              </p>
            ) : (
              <p>
                <span className='quantity-show__changeRate__percentage'>
                  {changeRate >= 0 ? (
                    <RiseOutlined style={{ color: '#66EF88' }} />
                  ) : (
                    <FallOutlined style={{ color: '#E92929' }} />
                  )}{' '}
                  {Math.abs(changeRate)}%
                </span>
                <span className='quantity-show__changeRate__time'>
                  {timeOption === 'thisWeek' || dateDiff === 6 ? 'Last week' : 'Last month'}
                </span>
              </p>
            )}
          </div>
        )}
      </Spin>
    </div>
  )
}

export default QuantityShow
