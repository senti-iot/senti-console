import fakeData from './fakedata/data.json'
import moment from 'moment';

const updateFilters = 'updateFilters'
const changeTRP = 'changeTableRows'
const changeMT = 'changeMapTheme'
const changeCT = 'changeChartType'
const changeHM = 'changeHeatMap'
const changeYAXIS = 'changeYAxis'
const changeCPP = 'changeCardsPerPage'
const changeEventHandler = 'changeEH'
const changeSM = 'changeSmallmenu'
const changeT = 'changeTabs'
const getSettings = 'getSettings'

export const changeSmallMenu = (val) => { 
	return dispatch => { 
		dispatch({
			type: changeSM,
			smallMenu: val
		})
	}
}
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
		let trp = val
		if (val === 'auto') {
			let height = window.innerHeight
			let rows = Math.round((height - 70 - 48 - 30 - 64 - 56 - 30 - 56 - 30) / 49)
			trp = rows
		}
		dispatch({ type: changeTRP, trp: trp, trpStr: val })
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
export const changeTabs = tabs => { 
	return dispatch => { 
		dispatch({
			type: changeT,
			tabs: tabs
		})
	}
}

//#region Fake Data
let avg = (data) => {
	let count = 0;
	let total = 0;
	Object.keys(data).forEach((k, i) => {
		count = count + 1;
		total = parseFloat((parseFloat(total) + parseFloat(data[k])).toFixed(3))
	});
	return (total / count).toFixed(3)
};
let avgPerHour = (data) => {
	let d = Object.keys(data)
	let newData = {};
	for (let index = 1; index < d.length; index++) {
		let value = data[d[index]] - data[d[index - 1]];
		newData[d[index]] = value.toFixed(3)
	}
	return newData
}
const fake_dashboardData = [{
	dashId: 0,
	myUsage: {
		period: {
			from: "2019-06-06 00:00:00",
			to: "2019-06-11 00:00:00"
		},
		data: avg(avgPerHour(fakeData))
	},
	otherUsage: {
		period: {
			from: moment("2019-06-06 00:00:00"),
			to: "2019-06-11 00:00:00"
		},
		data: 0.612
	},
	weekly: {
		period: {
			from: moment("2019-06-06 00:00:00"),
			to: moment("2019-06-11 00:00:00")
		},
		data: avgPerHour(fakeData)
	},
	meter: {
		period: {
			from: "2019-06-06 00:00:00",
			to: "2019-06-11 00:00:00"
		},
		data: fakeData
	}
}]

//#endregion

const initialState = {
	tabs: {
		id: '',
		route: 0,
		data: [],
		// filters: {
		// keyword: ''
		// },
		tabs: [],
		// noSearch: true
	},
	eH: true,
	CPP: 9,
	chartYAxis: 'linear',
	trpStr: null,
	heatMap: false,
	chartType: null,
	mapTheme: null, 
	smallMenu: true,
	trp: null,
	dashboardData: fake_dashboardData,
	dashboards: [{
		name: 'Min Vand',
		description: 'My water consumption',
		periodType: 3,
		device: {
			id: 38, name: 'sigfoxTempSensor'
		},
		color: 'deepPurple',
		dsType: 0
	}, /* {
		name: 'New',
		description: 'This is a demo test for new dashboards',
		periodType: 3,
		device: {
			id: 38, name: 'sigfoxTempSensor'
		},
		color: 'deepPurple',
		dsType: 0
	}, {
		name: 'Dashboard',
		description: 'This is a demo test for new dashboards',
		periodType: 3,
		color: 'lime',
		device: {
			id: 38, name: 'sigfoxTempSensor'
		},
		dsType: 0
	}, {
		name: 'Here',
		description: 'This is a demo test for new dashboards',
		periodType: 3,
		color: 'cyan',
		device: {
			id: 38, name: 'sigfoxTempSensor'
		},
		dsType: 0
	} */],
	filters: {
		favorites: [],
		projects: [],
		devices: [],
		collections: [],
		orgs: [],
		users: [],
		registries: [],
		devicetypes: [],
		sensors: [],
		functions: []
	 }

}

export const appState = (state = initialState, action) => {
	switch (action.type) {
		case changeT:
			return Object.assign({}, state, { tabs: action.tabs })
		case getSettings: 
			return Object.assign({}, state, { smallMenu: action.settings.drawerState !== undefined ? action.settings.drawerState : true })
		case changeSM: 
			return Object.assign({}, state, { smallMenu: action.smallMenu })
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
