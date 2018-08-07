import { createStore, combineReducers } from 'redux'
import { settings } from './settings'
import { localization } from './localization'

let reducers = combineReducers({ settings, localization })
export const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())