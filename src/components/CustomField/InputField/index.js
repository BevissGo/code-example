import React from 'react'
import { ErrorMessage } from 'formik'
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap'

import './style.scss'

const InputField = (props) => {
  const { field, form, type, label, placeholder, disabled, extraClass } = props
  const { name } = field
  const { errors, touched } = form
  const showError = errors[name] && touched[name]

  return (
    <FormGroup className={`input-field ${extraClass}`}>
      {label && (
        <Label for={name}>
          <p>{label}</p>
        </Label>
      )}

      <div>
        <Input
          id={name}
          {...field}
          type={type}
          disabled={disabled}
          invalid={showError}
          placeholder={placeholder}
        />
      </div>
      <ErrorMessage name={name} component={FormFeedback} />
    </FormGroup>
  )
}

export default InputField
