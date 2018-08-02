import { createStore } from 'redux'
import { settings } from './settings'

export const store = createStore(settings, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())