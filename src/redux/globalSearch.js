import { suggestionGen } from 'variables/functions';

const getS = 'getSuggestions'

export const getSuggestions = () => 
	(dispatch, getState) => {
		let projects = getState().data.projects
		let devices = getState().data.devices
		let collections = getState().data.collections
		let users = getState().data.users
		let orgs = getState().data.orgs
		let suggestions = []
		// console.log(projects, devices, collections, users, orgs)
		suggestions.push(...suggestionGen(projects))
		suggestions.push(...suggestionGen(devices))
		suggestions.push(...suggestionGen(collections))
		suggestions.push(...suggestionGen(users))
		suggestions.push(...suggestionGen(orgs))

		// console.log(suggestions)
		return dispatch({
			type: getS,
			payload: suggestions
		})
	}

const initialState = {
	suggestions: []
}

export const globalSearch = (state = initialState, { type, payload }) => {
	switch (type) {

		case getS:
			return { ...state, ...payload }

		default:
			return state
	}
}
