import './styles.scss'
import { Input } from 'antd'
import React from 'react'

const InputAntd = (props) => {
  return <Input className={props.isPrefix ? 'input-with-prefix' : 'input-antd'} {...props}/>
}

export default InputAntd
