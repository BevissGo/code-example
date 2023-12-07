import React from 'react'
import { Link } from 'react-router-dom'

import { formatDate } from 'utils/formatDate'

import './style.scss'

const CardBlog = ({ blogPage, blogData }) => {
  const { slug, title, meta_description, thumbnail_image } = blogData
  return (
    <div className={`card-blog${blogPage ? ' blog-page' : ''}`}>
      <div className={'card-blog__thumbnail'}>
        <img
          alt=''
          src={
            thumbnail_image ||
            'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'
          }
        />
      </div>
      <div className={'card-blog__content'}>
        <Link to={`/blog/${slug}`} className='view-detail-blog'>
          <p className='card-blog__title'>{title}</p>
        </Link>
        <p className='card-blog__description'>{meta_description}</p>
        <p className='card-blog__date'>{formatDate(blogData.created_at)}</p>
      </div>
    </div>
  )
}

export default CardBlog
