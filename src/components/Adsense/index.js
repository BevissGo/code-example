import React, { useEffect } from 'react'

export const Adsense = ({ className, style }) => {
  useEffect(() => {
    const parentElement = document.querySelector('.adsbygoogle-parent')
    if (parentElement && parentElement.offsetWidth > 0) {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }, [])

  return (
    <div className='adsbygoogle-parent' style={{ display: 'inline-block', width: '100%' }}>
      <ins
        data-ad-format='auto'
        data-ad-slot='7297910363'
        data-full-width-responsive='true'
        style={{ ...style, display: 'block' }}
        data-ad-client='ca-pub-4698513360489755'
        className={`${className || ''} adsbygoogle`}
      />
    </div>
  )
}

export const AdsenseFullWidth = ({ className, style }) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  return (
    <ins
      data-ad-format='fuild'
      data-ad-slot='7297910363'
      data-full-width-responsive='true'
      data-ad-client='ca-pub-4698513360489755'
      className={`${className || ''} adsbygoogle`}
      style={{ ...style, display: 'block', height: '90px' }}
    />
  )
}
