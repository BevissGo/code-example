import React from 'react'
import { Input } from 'antd'

import './style.scss'

const { Search } = Input

const CustomSearch = ({ setSearchInput }) => {

  const handleSearch = (input) => {
    setSearchInput(input)
  }

  return (
    <Search
      className='custom-search'
      size='large'
      placeholder='Search campaign name'
      allowClear
      onSearch={handleSearch}
    />
  )
}

export default CustomSearch