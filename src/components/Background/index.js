import React from 'react'

import './style.scss'

const BackgroundPage = ({ signup, footer }) => {
  const generateClassNameOutline = () => {
    return `outline${signup ? ' signup' : ''}`
  }

  const generateClassNameBackground = () => {
    return `background-page${footer ? ' footer' : ''}${signup ? ' signup' : ''}`
  }

  const generateClassNameCircle = (type) => {
    return `circle circle--${type}${signup ? ' signup' : ''}`
  }

  return (
    <div className={generateClassNameBackground()}>
      <div className='flex'>
        <div className={generateClassNameOutline()}>
          <div
            className={`${generateClassNameCircle(
              'quarter'
            )} background--spray translate--bl`}
          ></div>
        </div>
        <div className={generateClassNameOutline()}>
          <div
            className={`${generateClassNameCircle(
              'quarter'
            )} background--sherpa-blue-1 translate--br`}
          ></div>
        </div>
        <div
          className={`${generateClassNameOutline()} ${signup ? ' push' : ''}`}
        >
          <div
            className={`${generateClassNameCircle('full')} background--yellow`}
          ></div>
        </div>
        <div className={generateClassNameOutline()}>
          <div
            className={`${generateClassNameCircle(
              'quarter'
            )} background--beauty-bush translate--bl`}
          ></div>
        </div>
      </div>
      <div className='flex'>
        <div>
          <div className={`outline outline--high${signup ? ' signup' : ''}`}>
            <div
              className={`${generateClassNameCircle(
                'half'
              )} background--bittersweet translate--br`}
            ></div>
          </div>
        </div>
        <div>
          <div className={generateClassNameOutline()}>
            <div
              className={`${generateClassNameCircle(
                'full'
              )} background--yellow`}
            ></div>
          </div>
          <div className={generateClassNameOutline()}>
            <div
              className={`${generateClassNameCircle(
                'quarter'
              )} background--beauty-bush translate--br`}
            ></div>
          </div>
        </div>
        <div className={`${signup ? 'push' : ''}`}>
          <div className={generateClassNameOutline()}>
            <div
              className={`${generateClassNameCircle(
                'quarter'
              )} background--spray translate--bl`}
            ></div>
          </div>
          <div className={generateClassNameOutline()}>
            <div
              className={`${generateClassNameCircle(
                'full'
              )} background--sherpa-blue-1`}
            ></div>
          </div>
        </div>
        <div>
          <div className={generateClassNameOutline()}>
            <div
              className={`${generateClassNameCircle('quarter')} background--${
                signup ? 'green' : footer ? 'chalky' : 'white'
              }`}
            ></div>
          </div>
          <div className={generateClassNameOutline()}>
            <div
              className={`${generateClassNameCircle(
                'quarter'
              )} background--yellow translate--bl`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackgroundPage
