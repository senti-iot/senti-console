import { settings } from './settings'
import { localization } from './localization'
import { favorites } from './favorites'
import { doi } from './doi'
import { appState } from './appState'
import { dateTime } from './dateTime'
import { data } from './data'
import { globalSearch } from './globalSearch'
import { weather } from './weather'
import { dsSystem } from './dsSystem'
import { serviceWorkerReducer } from './serviceWorkerRedux'
import { combineReducers } from 'redux'

// import zendesk from 'lib/stores/ChatStore'
let reducers = combineReducers({
	settings,
	localization,
	favorites,
	doi,
	appState,
	dateTime,
	data,
	globalSearch,
	weather,
	dsSystem,
	serviceWorkerReducer /* zendesk */
})
/**
*	 Debugging purposes
**/
// const logger = store => next => action => {
//  console.info('dispatching', action)
// 	let result = next(action)
// 	console.info('next state', store.getState())
// 	return result
// }
const rootReducer = (state, action) => {
	if (action.type === 'RESET_APP') {
		state = undefined
	}
	return reducers(state, action)
}

export default rootReducer