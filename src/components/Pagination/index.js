import React from 'react'
import { Pagination as APagination } from 'antd'

import { ITEM_PER_PAGE } from 'constants/options'

import './style.scss'

const Pagination = ({ total, currentPage, onPageChange }) => {
  return (
    <APagination
      hideOnSinglePage
      defaultCurrent={1}
      current={currentPage}
      defaultPageSize={ITEM_PER_PAGE}
      total={total}
      showSizeChanger={false}
      onChange={(page) => {
        onPageChange(page)
      }} />
  )
}

export default Pagination