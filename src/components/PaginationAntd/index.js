import React from 'react'
import { Pagination, Row } from 'antd'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'

import './style.scss'

const PaginationAntd = ({ currentPage, total, pageSize, disabled, onPageChange, position }) => {
  return (
    <Row style={{ marginTop: 20 }} justify={position ? position : 'start'} align='middle'>
      <Pagination
        className='user-pagination'
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={onPageChange}
        disabled={disabled}
        showSizeChanger={false}
        itemRender={(_, type, originalElement) => {
          switch (type) {
            case 'prev':
              return (
                <button className='ant-pagination-item-link'>
                  <DoubleLeftOutlined />
                </button>
              )
            case 'next':
              return (
                <button className='ant-pagination-item-link'>
                  <DoubleRightOutlined />
                </button>
              )
            default:
              return originalElement
          }
        }}
      />
    </Row>
  )
}

export default PaginationAntd
