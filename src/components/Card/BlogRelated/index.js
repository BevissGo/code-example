import React from 'react'

import { formatDate } from 'utils/formatDate'

import './style.scss'

const CardBLogRelated = ({ relatedBlog }) => {
  const { title, meta_description, thumbnail_image } = relatedBlog

  return (
    <div className='card-blog-related'>
      <img
        alt=''
        src={
          thumbnail_image ||
          'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'
        }
      />
      <div className='card-blog-related__left'>
        <p className='card-blog-related__left__title'>{title}</p>
        <p className='card-blog-related__left__description'>{meta_description}</p>
        <p className='card-blog-related__left__date'>{formatDate(relatedBlog.created_at)}</p>
      </div>
    </div>
  )
}

export default CardBLogRelated
