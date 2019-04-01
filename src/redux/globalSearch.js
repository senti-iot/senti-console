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
		let devices = getState().data.devices
		// let collections = getState().data.collections
		// let users = getState().data.users
		// let orgs = getState().data.orgs
		let suggestions = []
		let dSuggestions = []
		let pSuggestions = []
		// console.log(projects, devices, collections, users, orgs)
		projects.forEach(p => {
			pSuggestions.push({
				label: p.title,
				path: `/project/${p.id}`,
				type: types[0],
				values: globalSuggestionGen(p)
			})
		})
		devices.forEach(d => {
			dSuggestions.push({
				label: d.name,
				path: `/device/${d.id}`,
				type: types[1],
				values: globalSuggestionGen(d)
			})
		})
		// suggestions.push(...globalSuggestionGen(projects))
		// suggestions.push(...globalSuggestionGen(devices))
		// suggestions.push(...globalSuggestionGen(collections))
		// suggestions.push(...globalSuggestionGen(users))
		// suggestions.push(...globalSuggestionGen(orgs))
		suggestions = [
			{ 
				title: 'sidebar.projects',
				suggestions: pSuggestions },
			{ 
				title: 'sidebar.devices',
				suggestions: dSuggestions
			}
		]

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
