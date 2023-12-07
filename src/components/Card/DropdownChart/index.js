import React from 'react'
import { Dropdown, Menu, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'

import ChartCard from 'components/Card/Chart'
import BarLineChart from 'components/Chart/BarLineChart'

const DropdownChart = ({ title, dropdownData, ...chartData }) => {
  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <span>Option 1</span>
      </Menu.Item>
      <Menu.Item key='2'>
        <span>Option 2</span>
      </Menu.Item>
    </Menu>
  )

  const dropdown = (
    <>
      <span>{dropdownData.title ? dropdownData.title + ': ' : ''}</span>
      <Dropdown overlay={menu} trigger={['click']}>
        <span onClick={e => e.preventDefault()} style={{ color: '#454545' }}>
          <Space>
            {dropdownData.text}
            <DownOutlined />
          </Space>
        </span>
      </Dropdown>
    </>
  )

  return (
    <ChartCard title={title} chart={<BarLineChart {...chartData} />} rightItem={dropdown} />
  )
}

export default DropdownChart