import React from 'react'
import { Checkbox } from 'antd'

import { ReactComponent as IconTrashBin } from 'assets/images/dashboard/trash_bin.svg'

import './style.scss'

const EventItem = ({ title, time, color, deleteHandler }) => {
  return (
    <div className={`event-list__item ${color}`}>
      <div className='item-content'>
        <div className='item-content__title'>
          {title}
        </div>
        <div className='item-content__time'>
          {time}
        </div>
      </div>
      <div className='item-action__wrapper'>
        <div className='item-action'>
          <div className='item-action__done'>
            <Checkbox />
          </div>
          <div className='item-action__remove'>
            <IconTrashBin onClick={deleteHandler} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventItem