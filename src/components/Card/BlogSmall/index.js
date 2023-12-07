import React from 'react'

import './style.scss'

const CardBlogSmall = ({ popularBlogList }) => {
  const { title, thumbnail_image } = popularBlogList

  return (
    <div className='card-blog-small'>
      <img
        alt=''
        src={
          thumbnail_image ||
          'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'
        }
      />
      <div className='card-blog-small__left'>
        <p className='card-blog-small__title'>{title}</p>
      </div>
    </div>
  )
}

export default CardBlogSmall
