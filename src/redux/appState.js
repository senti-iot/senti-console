const updateFilters = 'updateFilters'
const changeTRP = 'changeTableRows'
const changeMT = 'changeMapTheme'
const changeCT = 'changeChartType'
const changeHM = 'changeHeatMap'

export const changeHeatMap = (val) => {
	return (dispatch) => {
		dispatch({ type: changeHM, heatMap: val })
	}
}
export const changeChartType = (val) => {
	return (dispatch) => {
		dispatch({ type: changeCT, chartType: val })
	}
} 
export const changeMapTheme = (val) => {
	return (dispatch) => {
		dispatch({ type: changeMT, mapTheme: val })
	}
}

export const changeTableRows = (val) => { 
	return (dispatch, getState) => { 
		dispatch({ type: changeTRP, trp: val })
	}
}

export const addFilter = (f, type) => {
	return (dispatch, getState) => {
		let filters = []
		filters = [...getState().appState.filters[type]]
		let id = filters.length
		filters.push({ ...f })
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
		let filters = []
		filters = [...getState().appState.filters[type]]
		filters = filters.filter(filter => filter.id !== f)
		dispatch({
			type: updateFilters,
			filters: {
				[type]: filters
			}
		})
	}
}
const initialState = {
	heatMap: null,
	chartType: null,
	mapTheme: null, 
	trp: null,
	filters: {
		projects: [],
		devices: [],
		collections: [],
		orgs: [],
		users: [] }

}

export const appState = (state = initialState, action) => {
	switch (action.type) {
		case changeHM: 
			return Object.assign({}, state, { heatMap: action.heatMap })
		case changeCT: 
			return Object.assign({}, state, { chartType: action.chartType })
		case changeMT: 
			return Object.assign({}, state, { mapTheme: action.mapTheme })
		case changeTRP: 
			return Object.assign({}, state, { trp: action.trp })
		case updateFilters:
			return Object.assign({}, state, { filters: { ...state.filters, ...action.filters } })
		default:
			return state
	}
}
