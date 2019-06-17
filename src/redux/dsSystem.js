// import { getSensorDataClean } from 'variables/dataRegistry';
import moment from 'moment'
// import { createSelector } from 'reselect'

export const getDashboards = 'getDashboards'
export const SetDashboard = 'SetDashboard'
export const setDashboardData = 'setDashboardData'
export const gotDashboardData = 'gotDashboardData'
export const setGraphs = 'setGraphs'

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
export const getPeriod = (state, id) => {
	let gs = state.dsSystem.graphs
	let g = gs[gs.findIndex(r => r.id === id)]
	return g.period
}

export const getGraph = (state, id) => {
	let gs = state.dsSystem.graphs
	let g = gs[gs.findIndex(r => r.id === id)]
	return g
}

export const handleSetDate = (dId, gId, p) => {
	return async (dispatch, getState) => {
		let gs = getState().dsSystem.graphs
		let graph = gs[gs.findIndex(g => g.id === gId)]
		graph.period = p
		graph.periodType = p.menuId
		gs[gs.findIndex(g => g.id === gId)] = graph 
		// ds[ds.findIndex(d => d.id === dId)] = dash
		dispatch({ type: setGraphs, payload: gs })

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


const initialState = {
	dashboards: [],
	dashboard: null,
	gotDashboardData: true,
	graphs: []
}

const setState = (key, payload, state) => Object.assign({}, state, { [key]: payload })

export const dsSystem = (state = initialState, { type, payload }) => {
	switch (type) {
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
