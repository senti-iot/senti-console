const updateFilters = 'updateFilters'
const changeTRP = 'changeTableRows'
const changeMT = 'changeMapTheme'
const changeCT = 'changeChartType'
const changeHM = 'changeHeatMap'
const changeYAXIS = 'changeYAxis'
const changeCPP = 'changeCardsPerPage'
const changeEventHandler = 'changeEH'

export const changeEH = (bool) => { 
	return dispatch => { 
		dispatch({ type: changeEventHandler, EH: bool })
	}
}
export const changeCardsPerPage = (val) => {
	return (dispatch) => { 
		dispatch({ type: changeCPP, CPP: val })
	}
}
export const changeYAxis = (val) => { 
	return (dispatch) => { 
		dispatch({ type: changeYAXIS, chartYAxis: val })
	}
}
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
		filters.push({ ...f, id })
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
		
		filters = filters.filter(filter => {
			return filter.id !== f.id
		})
		dispatch({
			type: updateFilters,
			filters: {
				[type]: filters
			}
		})
	}
}
const initialState = {
	eH: true,
	CPP: 9,
	chartYAxis: 'linear',
	heatMap: false,
	chartType: null,
	mapTheme: null, 
	trp: null,
	filters: {
		favorites: [],
		projects: [],
		devices: [],
		collections: [],
		orgs: [],
		users: [] }

}

export const appState = (state = initialState, action) => {
	switch (action.type) {
		case changeEventHandler: 
			return Object.assign({}, state, { EH: action.EH })
		case changeCPP: 
			return Object.assign({}, state, { CPP: action.CPP })
		case changeYAXIS:
			return Object.assign({}, state, { chartYAxis: action.chartYAxis })
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
