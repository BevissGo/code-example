import React from 'react'
import { Button, Modal } from 'antd'
import { DeleteFilled, EditFilled } from '@ant-design/icons'

import './style.scss'

function DetailModal({ record, isOpen, handleCloseModal, handleEdit, handleDelete }) {
  return (
    <Modal
      className='detail-position-modal'
      title={record?.position}
      width='70%'
      open={isOpen}
      centered
      onCancel={handleCloseModal}
      footer={() => (
        <>
          <Button className='detail-position-modal__edit-btn' onClick={() => handleEdit(record)}>
            <EditFilled />
            <span>Edit</span>
          </Button>
          <Button className='detail-position-modal__delete-btn' onClick={() => handleDelete(record)}>
            <DeleteFilled />
            <span>Delete</span>
          </Button>
        </>
      )}
    >
      <div className='detail-position-modal__wrapper'>
        <p className='detail-position-modal__description'>Description</p>
        <p className='detail-position-modal__content'>{record?.description ?? 'None'}</p>
      </div>
    </Modal>
  )
}

export default DetailModal
