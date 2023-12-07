import React from 'react'

const ContentCallTest = ({content, href, showButton}) => (
  <div className='process-disc__content'>
      <p className='process-disc__content__title'>
          {content.title}
      </p>
      <p className='process-disc__content__description'>
          {content.content}
      </p>
      {showButton && (
        <div className='disc__button-section'>
            <a href={href} className='button-default'>{content.textButton}</a>
        </div>
      )}
  </div>
)

export default ContentCallTest
