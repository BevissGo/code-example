import { Blog } from 'constants/actionTypes'

const initialState = {
  listBlog: Array(4).fill({}),
  loadingGet: false,
  isInitialized: false,
}

const blog = (state = initialState, action) => {
  switch(action.type) {
    case Blog.REQUEST_GET_LIST_BLOG:
      return { ...state, loadingGet: true }
    case Blog.GET_LIST_BLOG:
      return {
        ...state,
        isInitialized: true,
        listBlog: action.payload.blogList,
        loadingGet: false
      }
    case Blog.FAIL_REQUEST_BLOG:
      return { ...state, loadingGet: false }
    default:
      return state
  }
}

export default blog
