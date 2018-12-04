import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { settings } from './settings'
import { localization } from './localization'
import { favorites } from './favorites'
import { doi } from './doi'
import thunk from 'redux-thunk';

let reducers = combineReducers({ settings, localization, favorites, doi })
let composeMiddleware = compose(
	applyMiddleware(thunk),
	window.devToolsExtension ? window.devToolsExtension() : f => f
)
export const store = createStore(reducers, composeMiddleware)