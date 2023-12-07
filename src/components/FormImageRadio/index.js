import React from 'react'

import './style.scss'
import InputImageRadio from '../Input/ImageRadio'

const FormImageRadio = ({
  listRadio,
  answerChose,
  dataQuestion,
  dataGroupAnswer,
  indexGroupQuestion,
}) => {
  return (
    <div className='form-image-radio'>
      {listRadio.map((radio, inx) => (
        <InputImageRadio
          key={inx}
          value={radio.value}
          label={radio.label}
          name={dataQuestion.alt}
          indexGroupQuestion={indexGroupQuestion}
          imgSrc={dataGroupAnswer[radio.label].src}
          imgAlt={dataGroupAnswer[radio.label].alt}
          defaultChecked={radio.value === answerChose}
        />
      ))}
    </div>
  )
}

export default FormImageRadio
