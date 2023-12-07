import React from 'react'
import { useHistory } from 'react-router-dom'

import { redirectToWithPush } from 'utils'

import './style.scss'

import closeButton from 'assets/images/icons/close.svg'

const Modal = ({ handlePopUp, content, target }) => {
    const history = useHistory()

    return (
        <div className='modal'>
            <div className='modal-wrap'>
                <div className='modal__content-container'>
                    <p className='modal__content-main'>{content}</p>
                </div>
                <div className='modal__btn-group' style={{
                    display: 'flex',
                    padding: '15px 30px 15px 30px'
                }}>
                    <button
                        className='modal__btn modal__btn-option modal__btn-ignore'
                        onClick={handlePopUp}
                    >
                        Bỏ qua
                    </button>
                    <button
                        className='modal__btn modal__btn-option modal__btn-continue'
                        onClick={() => redirectToWithPush(history, `/${target}`)}
                    >
                        Mua kết quả mở rộng
                    </button>
                </div>
                <button className='modal__btn modal__btn-cancel' onClick={handlePopUp}>
                    <img src={closeButton} width='30px' height='30px' alt='close' />
                </button>
            </div>
        </div>
    )
}

export default Modal