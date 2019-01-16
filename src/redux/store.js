import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { settings } from './settings'
import { localization } from './localization'
import { favorites } from './favorites'
import { doi } from './doi'
import thunk from 'redux-thunk';

let reducers = combineReducers({ settings, localization, favorites, doi })
let composeMiddleware = compose(
	applyMiddleware(thunk),
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)
const store = createStore(reducers, composeMiddleware)
const next = store.dispatch
store.dispatch = (action) => { 
	console.log('dispatching', action)
	let result = next(action)
	console.log('Next state', store.getState())
	return result

}
export default store