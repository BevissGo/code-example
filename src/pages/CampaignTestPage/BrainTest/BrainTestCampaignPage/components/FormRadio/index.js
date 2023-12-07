import React, { useCallback } from 'react'

import './style.scss'
import { useDispatch } from 'react-redux'
import { updateListLRBrainAnswer } from 'redux/actions/brainTest'
import LabelClickableInputRadio from 'components/Input/LabelClickableRadio'

const FormRadio = ({ index, listRadio, chosenAnswer }) => {
  const dispatch = useDispatch()
  const handleOnChange = useCallback(
    (answer) => {
      dispatch(updateListLRBrainAnswer(index, answer))
    },
    [dispatch, index]
  )

  return (
    <div className='brain-test'>
      <div className='form-radio'>
        {listRadio.map((radio, inx) => (
          <LabelClickableInputRadio
            key={inx}
            id={inx}
            value={radio.value}
            name={radio.questionId}
            label={radio.label}
            onChange={() => handleOnChange(radio.value)}
            defaultChecked={radio.value === chosenAnswer}
          />
        ))}
      </div>
    </div>
  )
}

export default FormRadio
