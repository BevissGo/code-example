import React from 'react'
import classNames from 'classnames'
import { Modal as AntModal } from 'antd'

import './style.scss'
import SecondaryButton from 'components/Button/SecondaryButton'
import PrimaryButton from 'components/Button/PrimaryButton'

const ConfirmationModal = ({
  title = '',
  content = '',
  centered = false,
  actionButtons,
  visible,
  children,
  className,
  okText = 'OK',
  cancelText = 'Cancel',
  okBtnProps = {},
  cancelBtnProps = {},
  onOK,
  onCancel,
  loadingOkBtn,
}) => {
  return (
    <AntModal
      title={title}
      open={visible}
      centered={centered}
      footer={null}
      className={classNames('confirm-modal', className)}
      onCancel={onCancel}
    >
      <div>
        <div className='modal-content-container'>{content || children}</div>
        <div className='modal-action-buttons-group'>
          {actionButtons || [
            <SecondaryButton {...cancelBtnProps} key='action-btn--cancel' onClick={onCancel}>
              {cancelText}
            </SecondaryButton>,
            <PrimaryButton
              loading={loadingOkBtn}
              {...okBtnProps}
              style={{ color: 'white' }}
              key='action-btn--confirm'
              onClick={onOK}
            >
              {okText}
            </PrimaryButton>,
          ]}
        </div>
      </div>
    </AntModal>
  )
}

export default ConfirmationModal
