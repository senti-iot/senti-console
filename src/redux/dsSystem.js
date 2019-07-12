// import { getSensorDataClean } from 'variables/dataRegistry';
import moment from 'moment'
import { graphType } from 'variables/dsSystem/graphTypes';
// import { createSelector } from 'reselect'

export const getDashboards = 'getDashboards'
export const SetDashboard = 'SetDashboard'
export const setDashboardData = 'setDashboardData'
export const gotDashboardData = 'gotDashboardData'
export const setGraphs = 'setGraphs'
export const cGraph = 'cGraph'
export const eGraph = 'eGraph'
export const cDash = 'cDash'
export const eDash = 'eDash'
export const setGraphE = 'setGraphE'

const menuSelect = (p, c) => {
	let to, from, timeType, chartType;
	switch (p) {
		case 0: // Today
			from = moment().startOf('day')
			to = moment()
			timeType = 1
			break;
		case 1: // Yesterday
			from = moment().subtract(1, 'd').startOf('day')
			to = moment().subtract(1, 'd').endOf('day')
			timeType = 1
			break;
		case 2: // This week
			from = moment().startOf('week').startOf('day')
			to = moment()
			timeType = 2
			break;
		case 3: // Last 7 days
			from = moment().subtract(7, 'd').startOf('day')
			to = moment()
			timeType = 2
			break;
		case 4: // last 30 days
			from = moment().subtract(30, 'd').startOf('day')
			to = moment()
			timeType = 2
			break;
		case 5: // last 90 days
			from = moment().subtract(90, 'd').startOf('day')
			to = moment()
			timeType = 2
			break;
		case 6:
			from = moment(p.from)
			to = moment(p.to)
			timeType = p.timeType
			break;
		default:
			break;
	}
	chartType = c
	return { to, from, timeType, chartType }
}

const generateID = (name) => {
	var randHex = function(len) {
		let maxlen = 8
		let min = Math.pow(16, Math.min(len, maxlen) - 1) 
		let max = Math.pow(16, Math.min(len, maxlen)) - 1
		let n   = Math.floor( Math.random() * (max - min + 1) ) + min
		let r   = n.toString(16);
		while ( r.length < len ) {
		   r = r + randHex( len - maxlen );
		}
		return r;
	  };
	return name.replace(/\s+/g, '-').toLowerCase() + '-' + randHex(8);
}

export const getPeriod = (state, id, create) => {
	if (create) {
		let gs = state.dsSystem.cGraphs
		let g = gs[gs.findIndex(r => r.id === id)]
		return g.period
	}
	let gs = state.dsSystem.graphs
	let g = gs[gs.findIndex(r => r.id === id)]
	return g.period
}

export const getGraph = (state, id, create) => {
	if (create) {
		let gs = state.dsSystem.cGraphs
		let g = gs[gs.findIndex(r => r.id === id)]
		return g
	}
	let gs = state.dsSystem.graphs
	let g = gs[gs.findIndex(r => r.id === id)]
	return g
}

export const handleSetDate = (dId, gId, p) => {
	return async (dispatch, getState) => {
		let gs = getState().dsSystem.graphs
		let graph = gs[gs.findIndex(g => g.id === gId)]
		if (graph) {
			graph.period = p
			graph.periodType = p.menuId
			gs[gs.findIndex(g => g.id === gId)] = graph 
			// ds[ds.findIndex(d => d.id === dId)] = dash
			dispatch({ type: setGraphs, payload: gs })
		}

	}
}

export const setDashboards = (payload) => {
	return async dispatch => {
		let ds = payload
		let allGraphs = []
		ds.forEach(d => {
			d.graphs.forEach(g => {
				g.period = menuSelect(g.periodType, g.chartType)
				g.period.menuId = g.periodType
				allGraphs.push(g)
			})
		})
		dispatch({
			type: getDashboards,
			payload: ds
		})
		dispatch({
			type: setGraphs,
			payload: allGraphs
		})
	}
}

export const createGraph = (payload) => {
	 return (dispatch, getState) => {
		let gs = []
		gs = [...getState().dsSystem.cGraphs]
		let newG = graphType(payload)
		newG.id = generateID(newG.name)
		newG.grid.i = newG.id
		newG.period = menuSelect(newG.periodType, newG.chartType)
		newG.period.menuId = newG.periodType
		gs.push(newG)
		dispatch({ type: cGraph, payload: gs })
	}
}
export const editGraphPos = (payload) => {
	return (dispatch, getState) => {
		let gs = [] 
		gs = getState().dsSystem.cGraphs
		let g = gs[gs.findIndex(f => f.id === payload.i)]
		g.grid = payload
		gs[gs.findIndex(f => f.id === payload.i)] = g
		dispatch({ type: eGraph, payload: gs })
	}
}
export const removeGE = (payload) => {
	return (dispatch, getState) => {
		let gs = []
		gs = getState().dsSystem.cGraphs
		gs = gs.filter(g => g.id !== payload.i)
		dispatch({
			type: cGraph,
			payload: gs
		})
	}
}
export const setGE = (payload) => {
	return (dispatch, getState) => {
		let gs = []
		gs = getState().dsSystem.cGraphs
		let g = null;
		if (payload) {
			g = gs[gs.findIndex(f => f.id === payload.i)]
		}
		dispatch({
			type: setGraphE,
			payload: g
		})
	}
}
export const editGraph = (newG) => {
	 return (dispatch, getState) => {
		let gs = []
		let nG = {}
		nG = newG
		gs = getState().dsSystem.cGraphs
		gs[gs.findIndex(f => f.id === nG.id)] = nG
		dispatch({ type: cGraph, payload: gs })
		dispatch({ type: setGraphE, payload: nG })
	}
}
export const createDash = () => {
	 return dispatch => {
		let newD = {
			id: generateID('My Dashboard'),
			name: 'My Dashboard',
			color: 'teal',
			description: '',
			graphs: []
		}
		dispatch({ type: cDash, payload: newD })
	}
}
export const editDash = (d) => {
	 return (dispatch) => {
		// let 
		dispatch({ type: eDash, payload: d })
	}
}


const initialState = {
	dashboards: [],
	dashboard: null,
	gotDashboardData: true,
	graphs: [],
	cDash: null,
	cGraphs: []
}

const setState = (key, payload, state) => Object.assign({}, state, { [key]: payload })

export const dsSystem = (state = initialState, { type, payload }) => {
	switch (type) {
		case setGraphE: 
			return setState('eGraph', payload, state)
		case cGraph: 
			return setState('cGraphs', payload, state)
		case eDash:
		case cDash: 
			return setState('cDash', payload, state)
		case setGraphs:
			return setState('graphs', payload, state)
		case getDashboards:
			return setState('dashboards', payload, state)
		case gotDashboardData:
			return setState('gotDashboardData', payload, state)
		default:
			return state
	}
}
