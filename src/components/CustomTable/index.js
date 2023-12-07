import React from 'react'
import { Table } from 'antd'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'

import './style.scss'

function CustomTable({ rowKey, tableRef, columns, dataSource, loading, expandable, handleChange, handleRowClick }) {
  return (
    <div className='custom-table'>
      <Table
        rowKey={rowKey ?? ((record) => record.key)}
        ref={tableRef}
        rowClassName='custom-table__table-row'
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        bordered={false}
        pagination={{
          position: ['bottomCenter'],
          itemRender: (_, type, originalElement) => {
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
          },
        }}
        expandable={expandable}
        onChange={handleChange}
        onRow={(record) => {
          return {
            onClick: () => handleRowClick(record),
          }
        }}
      />
    </div>
  )
}

export default CustomTable
