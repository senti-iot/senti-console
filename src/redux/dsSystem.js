import { getSensorDataClean } from 'variables/dataRegistry';
import moment from 'moment'

export const getDashboards = 'getDashboards'
export const SetDashboard = 'SetDashboard'
export const setDashboardData = 'setDashboardData'
export const gotDashboardData = 'gotDashboardData'


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

export const handleSetDate = (dId, gId, p) => {
	return async (dispatch, getState) => {
		console.log(p)
		dispatch({ type: gotDashboardData, payload: true })
		let ds = getState().dsSystem.dashboards
		let dash = ds[ds.findIndex(d => d.id === dId)]
		let graph = dash.graphs[dash.graphs.findIndex(g => g.id === gId)]
		graph.period = p
		graph.periodType = p.menuId
		dash.graphs[dash.graphs.findIndex(g => g.id === gId)] = graph 
		await dash.graphs.forEach(async g => {
			let data = await getSensorDataClean(g.dataSource.deviceId, g.period.from, g.period.to, g.dataSource.dataKey, g.dataSource.cf, g.dataSource.deviceType, g.dataSource.chartType)
			g.data = data
		})
		ds[ds.findIndex(d => d.id === dId)] = dash
		console.log(ds)
		dispatch({ type: setDashboardData, payload: dash })
		dispatch({ type: gotDashboardData, payload: false })
	}
}

export const setDashboards = (payload) => {
	return async dispatch => {
		let ds = payload
		ds.forEach(d => {
			d.graphs.forEach(g => {
				g.period = menuSelect(g.periodType, g.chartType)
			})
		})
		dispatch({
			type: getDashboards,
			payload: ds
		})
		
	}
}

export const getDashboardData = async (id) => {
	return async (dispatch, getState) => {
		dispatch({ type: gotDashboardData, payload: true })
		let ds = getState().dsSystem.dashboards
		let d = ds[ds.findIndex(c => c.id === id)]
		await d.graphs.forEach(async g => {
			let data = await getSensorDataClean(g.dataSource.deviceId, g.period.from, g.period.to, g.dataSource.dataKey, g.dataSource.cf, g.dataSource.deviceType, g.dataSource.chartType)
			g.data = data
		})
		ds[ds.findIndex(c => c.id === d.id)] = d
		dispatch({ type: setDashboardData, payload: d })
		dispatch({ type: gotDashboardData, payload: false })
	}
}


const setState = (key, payload, state) => Object.assign({}, state, { [key]: payload })
const initialState = {
	dashboards: [],
	dashboard: null,
	gotDashboardData: true
}

export const dsSystem = (state = initialState, { type, payload }) => {
	switch (type) {

		case getDashboards:
			return setState('dashboards', payload, state)
		case setDashboardData:
			return setState('dashboard', payload, state)
		case gotDashboardData:
			return setState('gotDashboardData', payload, state)
		default:
			return state
	}
}
