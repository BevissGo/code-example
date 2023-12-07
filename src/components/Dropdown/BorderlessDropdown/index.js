import React from 'react'
import { Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'

import './style.scss'

function BorderlessDropdown({ menuItems, title }) {
  return (
    <Dropdown
      className='borderless-dropdown'
      menu={{
        items: menuItems,
      }}
      trigger={['click']}
    >
      <Space>
        <span className='borderless-dropdown__title'>{title}</span>
        <DownOutlined style={{ fontSize: 12 }} />
      </Space>
    </Dropdown>
  )
}

export default BorderlessDropdown
