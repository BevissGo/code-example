import React from 'react'
import { chunk } from 'lodash'

import './style.scss'

const ListCharacteristics = ({ listCharacteristics }) => {
  const arr = chunk(
    listCharacteristics,
    Math.round(listCharacteristics.length / 2)
  )

  return (
    <div className='list-characteristics'>
      {arr.map((chunk, index) => (
        <ul key={index}>
          {chunk.map((characteristic, inx) => (
            <li key={inx} className='list-characteristics__item'>
              {characteristic}
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

export default ListCharacteristics
