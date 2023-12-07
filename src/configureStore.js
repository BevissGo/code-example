import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunkMiddleware from 'redux-thunk'

import rootReducer from 'redux/store'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['groupQuestion'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)))
  let persistor = persistStore(store)
  return { store, persistor }
}
