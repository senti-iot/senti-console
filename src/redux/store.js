import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { settings } from './settings'
import { localization } from './localization'
import { favorites } from './favorites'
import { doi } from './doi'
import { appState } from './appState'
import { dateTime } from './dateTime'
import { data } from './data'
import thunk from 'redux-thunk';
import { globalSearch } from './globalSearch'
// import zendesk from 'lib/stores/ChatStore'
let reducers = combineReducers({ settings, localization, favorites, doi, appState, dateTime, data, globalSearch /* zendesk */ })
/**
*	 Debugging purposes
**/ 
// const logger = store => next => action => {
//  console.log('dispatching', action)
// 	let result = next(action)
// 	console.log('next state', store.getState())
// 	return result
// } 

let composeMiddleware = compose(
	applyMiddleware(thunk, /* logger */),
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)
const store = createStore(reducers, composeMiddleware)


export default store