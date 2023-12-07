import React from 'react'
import { useDispatch } from 'react-redux'

import { updateListCustomTestAnswer } from 'redux/actions/customTest'
import LabelClickableInputRadio from 'components/Input/LabelClickableRadio'

import './style.scss'

const FormRadio = ({ index, listRadio, chosenAnswer }) => {
  const dispatch = useDispatch()

  const handleOnChange = (answerCorrect, answer) => {
    dispatch(updateListCustomTestAnswer(index, answerCorrect, answer))
  }

  return (
    <div className='custom-test'>
      <div className='form-radio'>
        {listRadio?.map((radio, inx) => {
          return (
            <LabelClickableInputRadio
              key={inx}
              id={inx}
              value={radio.value}
              name={radio.questionId}
              label={radio.label}
              onChange={() => handleOnChange(radio?.value, radio?.label)}
              defaultChecked={radio.value === chosenAnswer}
              isBottom
            />
          )
        })}
      </div>
    </div>
  )
}

export default FormRadio
