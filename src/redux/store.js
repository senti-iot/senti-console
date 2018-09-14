import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { settings } from './settings'
import { localization } from './localization'
import thunk from 'redux-thunk';

let reducers = combineReducers({ settings, localization })
let composeMiddleware = compose(
	applyMiddleware(thunk),
	window.devToolsExtension ? window.devToolsExtension() : f => f
)
export const store = createStore(reducers, composeMiddleware)