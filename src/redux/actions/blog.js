import { Blog } from 'constants/actionTypes'

export const requestGetListBlog = () => ({
  type: Blog.REQUEST_GET_LIST_BLOG,
})

export const getListBlog = (blogList) => ({
  type: Blog.GET_LIST_BLOG,
  payload: { blogList },
})

export const failRequestBlog = () => ({
  type: Blog.FAIL_REQUEST_BLOG,
})
