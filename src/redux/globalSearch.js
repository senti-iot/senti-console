import { globalSuggestionGen } from 'variables/functions';

const setVal = 'setSearchValue'
const getS = 'getSuggestions'
const types = [
	"project",
	"device",
	"collection",
	"user",
	"org",
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
		let collections = getState().data.collections
		let users = getState().data.users
		let orgs = getState().data.orgs
		let suggestions = []

		let dSuggestions = []
		let cSuggestions = []
		let oSuggestions = []
		let uSuggestions = []
		let pSuggestions = []

		devices.forEach(d => {
			dSuggestions.push({
				label: d.name,
				path: `/device/${d.id}`,
				type: types[1],
				values: globalSuggestionGen(d)
			})
		})
		collections.forEach(p => {
			cSuggestions.push({
				label: p.name,
				path: `/collection/${p.id}`,
				type: types[2],
				values: globalSuggestionGen(p)
			})
		})
		projects.forEach(p => {
			pSuggestions.push({
				label: p.title,
				path: `/project/${p.id}`,
				type: types[0],
				values: globalSuggestionGen(p)
			})
		})
		users.forEach(p => {
			delete p.aux.senti
			delete p.groups
			uSuggestions.push({
				label: `${p.firstName} ${p.lastName}`,
				path: `/management/user/${p.id}`,
				type: types[3],
				values: globalSuggestionGen(p)
			})
		})
		orgs.forEach(p => {
			oSuggestions.push({
				label: p.name,
				path: `/management/org/${p.id}`,
				type: types[4],
				values: globalSuggestionGen(p)
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
				suggestions: pSuggestions 
			},
			{ 
				title: 'sidebar.devices',
				suggestions: dSuggestions
			},
			{ 
				title: 'sidebar.collections',
				suggestions: cSuggestions
			},
			{ 
				title: 'sidebar.users',
				suggestions: uSuggestions
			},
			{ 
				title: 'sidebar.orgs',
				suggestions: oSuggestions
			},
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
