import { globalSuggestionGen } from 'variables/functions';

const setVal = 'setSearchValue'
const getS = 'getSuggestions'
const types = [
	"sidebar.projects",
	"sidebar.devices",
	"sidebar.collections",
	"sidebar.users",
	"sidebar.orgs",
]
export const setSearchValue = (value) => {
	return dispatch => {
		dispatch({
			type: setVal,
			payload: value
		})
	}
}
export const getSuggestions = () => 
	(dispatch, getState) => {
		let projects = getState().data.projects
		// let devices = getState().data.devices
		// let collections = getState().data.collections
		// let users = getState().data.users
		// let orgs = getState().data.orgs
		let suggestions = []
		// console.log(projects, devices, collections, users, orgs)
		projects.forEach(p => {
			suggestions.push({
				label: p.title,
				path: `/project/${p.id}`,
				type: types[0],
				values: globalSuggestionGen(p)
			})
		})
		// suggestions.push(...globalSuggestionGen(projects))
		// suggestions.push(...globalSuggestionGen(devices))
		// suggestions.push(...globalSuggestionGen(collections))
		// suggestions.push(...globalSuggestionGen(users))
		// suggestions.push(...globalSuggestionGen(orgs))
		
		console.log(suggestions)
		return dispatch({
			type: getS,
			payload: suggestions
		})
	}

const initialState = {
	suggestions: [],
	searchVal: ''
}

export const globalSearch = (state = initialState, { type, payload }) => {
	switch (type) {
		case setVal: 
			return Object.assign({}, state, { searchVal: payload })
		case getS:
			return Object.assign({}, state, { suggestions: payload })

		default:
			return state
	}
}
