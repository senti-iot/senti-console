import { getSensorDataClean } from 'variables/dataRegistry';
import moment from 'moment'

export const getDashboards = 'getDashboards'
export const SetDashboard = 'SetDashboard'
export const setDashboardData = 'setDashboardData'

const menuSelect = (p) => {
	let to, from;
	switch (p) {
		case 0: // Today
			from = moment().startOf('day')
			to = moment()
			break;
		case 1: // Yesterday
			from = moment().subtract(1, 'd').startOf('day')
			to = moment().subtract(1, 'd').endOf('day')
			break;
		case 2: // This week
			from = moment().startOf('week').startOf('day')
			to = moment()
			break;
		case 3: // Last 7 days
			from = moment().subtract(7, 'd').startOf('day')
			to = moment()
			break;
		case 4: // last 30 days
			from = moment().subtract(30, 'd').startOf('day')
			to = moment()
			break;
		case 5: // last 90 days
			from = moment().subtract(90, 'd').startOf('day')
			to = moment()
			break;
		case 6:
			from = moment(p.from)
			to = moment(p.to)
			break;
		default:
			break;
	}
	return { to, from }
}

export const setDashboards = (payload) => {
	return async dispatch => {
		let ds = payload
		// console.log('trying')
		ds.forEach(d => {
			d.graphs.forEach(g => {
				console.log(g.periodType)
				g.period = menuSelect(g.periodType)
			})
		})
		dispatch({
			type: getDashboards,
			payload: ds
		})
		dispatch(await getDashboardData(payload[0].name))
	}
}
export const setDashboard = (payload) => {
	return async dispatch => {

		dispatch({ type: SetDashboard, payload })
	}
}

export const getDashboardData = async (dsName) => {
	return async (dispatch, getState) => {
		console.log('bing')
		let ds = getState().dsSystem.dashboards
		let d = ds[ds.findIndex(c => c.name === dsName)]
		console.log(d, dsName, )
		await d.graphs.forEach(async g => {
			let data = await getSensorDataClean(g.dataSource.deviceId, g.period.from, g.period.to, g.dataSource.dataKey, g.dataSource.cf)
			g.data = data
		})
		ds[ds.findIndex(c => c.name === d.name)] = d
		console.log(ds)
		dispatch({ type: setDashboardData, ds })
	}
}

const setState = (key, payload, state) => Object.assign({}, state, { [key]: payload })
const initialState = {
	dashboards: [],
	dashboard: null
}

export const dsSystem = (state = initialState, { type, payload }) => {
	switch (type) {

		case getDashboards:
			return setState('dashboards', payload, state)

		default:
			return state
	}
}
