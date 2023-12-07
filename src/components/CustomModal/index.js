import React from 'react'
import { Modal } from 'antd'

import './style.scss'

function CustomModal({ className, title, isOpen, footer, whiteBackground, handleCloseModal, children }) {
  return (
    <Modal
      className={`custom-modal${whiteBackground ? '--white' : ''} ${className ? className : ''}`}
      title={title}
      open={isOpen}
      centered
      width='80%'
      maskClosable={false}
      onCancel={handleCloseModal}
      footer={footer ?? null}
    >
      {children}
    </Modal>
  )
}

export default CustomModal
