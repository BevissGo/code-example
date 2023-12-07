import './style.scss'
import React from 'react'

import { Button } from 'antd'

const ButtonAntd = ({
  btnRef,
  title,
  width,
  icon,
  className = 'button-antd-custom',
  textColor = 'white',
  type = 'primary',
  onButtonClick = null,
  spacingRight = false,
  ...props
}) => {
  return (
    <Button
      ref={btnRef}
      className={className}
      type={type}
      icon={icon}
      onClick={onButtonClick}
      style={{ width: width ? width : undefined, marginRight: spacingRight ? '16px' : 0 }}
      {...props}
    >
      <span style={{ color: textColor }}>{title}</span>
    </Button>
  )
}

export default ButtonAntd
