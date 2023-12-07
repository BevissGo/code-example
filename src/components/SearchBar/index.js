import React from 'react'
import { Input } from 'antd'

import { ReactComponent as SearchIcon } from 'assets/images/icons/search.svg'

import './style.scss'

const SearchBar = ({ value, onChange }) => {
  return (
    <Input
      value={value}
      className='search-bar'
      placeholder={'Find...'}
      suffix={<SearchIcon style={{ marginLeft: 12 }} />}
      onChange={onChange}
    />
  )
}

export default SearchBar
