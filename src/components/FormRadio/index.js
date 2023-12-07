import React, { useCallback } from 'react'

import './style.scss'
import InputRadio from '../Input/Radio'

const FormRadio = ({ listRadio, answerChose, dataQuestion, dataGroupQuestion, onChangeRadio, onChoiceAnswer }) => {
  const { keyIdQuestion, question } = dataQuestion
  const { answer: dataAnswer, keyIdGroupQuestion } = dataGroupQuestion

  const handleDefaultChecked = (radio) => {
    return dataAnswer[radio.value] && dataAnswer[radio.value].keyIdQuestion === keyIdQuestion
  }

  const handleOnChange = useCallback(
    (radio) => () => {
      onChangeRadio(keyIdGroupQuestion, {
        keyIdQuestion: keyIdQuestion,
        // question,
        typeAnswer: radio.value,
      })
      onChoiceAnswer(radio.value, keyIdQuestion)
    },
    [keyIdQuestion, keyIdGroupQuestion, onChangeRadio, onChoiceAnswer],
  )

  return (
    <div className='form-radio'>
      {listRadio.map((radio, inx) => (
        <InputRadio
          key={inx}
          value={radio.value}
          question={question}
          label={radio.label}
          defaultChecked={handleDefaultChecked(radio)}
          name={keyIdGroupQuestion + '_' + radio.value}
          disabled={Object.values(answerChose).includes(keyIdQuestion)}
          onChange={handleOnChange(radio)}
        />
      ))}
    </div>
  )
}

export default FormRadio
