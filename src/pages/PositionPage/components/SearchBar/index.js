import React from 'react'
import { Input } from 'antd'

import { ReactComponent as SearchIcon } from 'assets/images/icons/search.svg'

import './style.scss'

const SearchBar = ({value, onChange}) => {
  return (
    <Input
      value={value}
      placeholder={'Find...'}
      suffix={<SearchIcon style={{ marginLeft: 12 }} />}
      style={{ marginRight: 118, borderRadius: '5px', height: 36, paddingLeft: 25, paddingRight: 13 }}
      onChange={onChange}
    />
  )
}

export default SearchBar