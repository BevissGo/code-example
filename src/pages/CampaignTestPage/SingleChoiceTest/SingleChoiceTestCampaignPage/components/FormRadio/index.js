import React from 'react'
import './style.scss'
import { useDispatch } from 'react-redux'
import { updateListSingleChoiceAnswer } from 'redux/actions/SingleChoiceTest'
import LabelClickableInputRadio from 'components/Input/LabelClickableRadio'

const FormRadio = ({ index, listRadio, chosenAnswer }) => {
  const dispatch = useDispatch()

  const handleOnChange = (answer) => {
    dispatch(updateListSingleChoiceAnswer(index, answer))
  }

  return (
    <div className='single-choice-test'>
      <div className='form-radio'>
        {listRadio.map((radio, inx) => (
          <LabelClickableInputRadio
            key={inx}
            id={inx}
            value={radio.value}
            name={radio.questionId}
            label={radio.label}
            onChange={() => handleOnChange(radio?.value)}
            defaultChecked={radio.value === chosenAnswer}
            isBottom
          />
        ))}
      </div>
    </div>
  )
}

export default FormRadio
