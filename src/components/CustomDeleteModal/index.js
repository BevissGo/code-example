import React from 'react'
import { Modal } from 'antd'

function CustomDeleteModal({ type, isOpen, confirmLoading, handleOk, handleCancel }) {
  return (
    <Modal
      title={`Delete ${type}`}
      open={isOpen}
      centered
      closable={false}
      maskClosable={false}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>This {type} will be permanently deleted. Are you sure you want to proceed?</p>
    </Modal>
  )
}

export default CustomDeleteModal
