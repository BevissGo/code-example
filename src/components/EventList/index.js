import React from 'react'
import { PlusOutlined } from '@ant-design/icons'

import EventItem from 'components/EventItem'

import './style.scss'

const EventList = ({ events, deleteEventHandler }) => {
  return (
    <div className='event-list__wrapper'>
      <div className='event-list'>
        <div className='event-list__header'>
          <div className='title'>{"Today's reminder"}</div>
          <div className='add-event'>
            <PlusOutlined />
          </div>
        </div>
        <div className='event-list__content'>
          {events.map((event) => (
            <div key={event.id} className='event'>
              <EventItem
                title={event.title}
                time={event.time}
                color={event.color}
                deleteHandler={() => deleteEventHandler(event.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventList
