import { shallowEqual } from 'recompose';

const updateFilters = 'updateFilters'
/*

removeFilter = (fId) => {
	let cFilters = this.state.filters.custom
	cFilters = cFilters.reduce((newFilters, f) => {
		if (f.id !== fId) {
			newFilters.push(f)
		}
		return newFilters
	}, [])
	this.setState({
		filters: {
			...this.state.filters,
			custom: cFilters
		}
	})
} */
export const addFilter = (f, type) => {
	return (dispatch, getState) => {
		let filters = []
		filters = [...getState().appState.filters[type]]
		let id = filters.length
		filters.push({ value: f.value, id: id, key: f.key, type: f.type })
		dispatch({
			type: updateFilters,
			filters: {
				[type]: filters
			}
		})
		return id
	}
}
export const editFilter = (f, type) => {
	return (dispatch, getState) => {
		let filters = []
		
		filters = [...getState().appState.filters[type]]
		let filterIndex = filters.findIndex(fi => fi.id === f.id)
		filters[filterIndex] = f
		dispatch({
			type: updateFilters,
			filters: {
				[type]: filters
			}
		})
	}
}
export const removeFilter = (f, type) => {
	return (dispatch, getState) => {
		console.log(f)
		let filters = []
		filters = [...getState().appState.filters[type]]
		filters = filters.filter(filter => filter.id !== f)
		console.log(filters)
		dispatch({
			type: updateFilters,
			filters: {
				[type]: filters
			}
		})
	}
}
const initialState = {
	chips: {
		devices: [],
		collections: [],
		projects: [],
		orgs: [],
		users: []
	},
	filters: {
		projects: [],
		devices: [],
		collections: [],
		orgs: [],
		users: [] }

}

export const appState = (state = initialState, action) => {
	switch (action.type) {

		case updateFilters:
			// let stat = Object.assign({}, state, { ...action.filters })
			let stat = { ...state, filters: { ...state.filters, ...action.filters } }
			console.log(state, stat, shallowEqual(state, stat))
			return stat

		default:
			return state
	}
}
