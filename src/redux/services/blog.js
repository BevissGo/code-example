import instance from 'api'
import { setHeader } from 'utils/setHeader'
import {
  getListBlog,
  failRequestBlog,
  requestGetListBlog,
} from '../actions/blog'
import { handleOpenModalFailure } from './modalError'

const fetchListBlog = (valueFilter) => async (dispatch) => {
  try {
    dispatch(requestGetListBlog())

    const header = await setHeader()
    const res = await instance.get(`/v2/blog?filter=${valueFilter}`, header)

    if (res.status === 200) {
      const { blogList } = res.data

      dispatch(getListBlog(blogList))
    } else {
      dispatch(failRequestBlog())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      })
    )
    dispatch(failRequestBlog())
  }
}

// const shouldFetchListBlog = (state) => {
//   const { isInitialized } = state
//   return !isInitialized
// }

export const fetchListBlogIfNeed = (valueFilter) => (dispatch) => {
  return dispatch(fetchListBlog(valueFilter))
}
