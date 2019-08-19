import moment from 'moment'
import { graphType } from 'variables/dsSystem/graphTypes';
import { saveOnServ, getSettings } from './settings';

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
const snackBar = 'snackBar'

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

export const generateID = (name) => {
	var randHex = function (len) {
		let maxlen = 8
		let min = Math.pow(16, Math.min(len, maxlen) - 1)
		let max = Math.pow(16, Math.min(len, maxlen)) - 1
		let n = Math.floor(Math.random() * (max - min + 1)) + min
		let r = n.toString(16);
		while (r.length < len) {
			r = r + randHex(len - maxlen);
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
	if (g.period)
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
			graph.period.timeType = p.timeType
			gs[gs.findIndex(g => g.id === gId)] = graph
			// ds[ds.findIndex(d => d.id === dId)] = dash
			dispatch({ type: setGraphs, payload: gs })
		}

	}
}
const gridCoords = (type) => {
	switch (type) {
		case 0:
			return 'chart'
		case 1:
			return 'gauge'
		case 2:
			return 'scorecardAB'
		case 3:
			return 'scorecard'
		case 4:
			return 'windcard'
		default:
			break;
	}
}
export const finishedSaving = () => {
	return {
		type: snackBar,
		payload: false
	}
}
export const saveSnackbar = (type) => {
	return {
		type: snackBar,
		payload: type
	}
}
export const repairDashboard = (dashboard) => {
	return async (dispatch, getState) => {
		let user, newD = {}
		user = getState().settings.user
		newD = { ...dashboard }
		user.aux.senti.dashboards[user.aux.senti.dashboards.findIndex(f => f.id === newD.id)] = newD
		dispatch(saveSnackbar('snackbars.repairedOldDashboards'))
		dispatch(saveOnServ(user))
		dispatch(await getSettings())

	}
}
export const setDashboards = (payload) => {
	return async dispatch => {
		let ds = payload
		let allGraphs = []
		let lastG = {}
		ds.forEach(d => {
			let brokenDash = false
			d.graphs.forEach((g, i) => {

				/**
				 * This if statement is for Users using v0 of Dashboards that were static and had no ability to be resized or moved
				 * If statement generates the missing grid prop and expanding each graph to half of screen and default height of the first for each row
				 * Should be removed in the future
				 */
				if (!g.grid) {
					brokenDash = true
					if (!d.graphs[i - 1]) {
						g.grid = graphType(gridCoords(g.type)).grid
						g.grid.w = 6
						lastG = g.grid
					}
					else {

						let newGrid = graphType(gridCoords(g.type)).grid
						let prevGrid = lastG
						g.grid = {
							...newGrid,
							x: prevGrid.x + prevGrid.w,
							y: prevGrid.y,
							h: prevGrid.h,
							w: 6
						}
						if ((g.grid.x + g.grid.w) > 12) {
							g.grid.y = prevGrid.h + prevGrid.y
							g.grid.x = 0
						}
						lastG = g.grid
						// }
					}
				}
				g.period = menuSelect(g.periodType, g.chartType)
				g.period.menuId = g.periodType

				allGraphs.push(g)
			})
			if (brokenDash) {
				dispatch(repairDashboard(d))
				brokenDash = false
			}
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
		if (d.graphs.length > 0)
			dispatch({ type: cGraph, payload: d.graphs })
	}
}

export const removeDashboard = id => {
	return async (dispatch, getState) => {
		let user = {}
		let ds = []
		user = getState().settings.user
		ds = user.aux.senti.dashboards
		ds = ds.filter(f => f.id !== id)
		user.aux.senti.dashboards = ds
		dispatch(saveOnServ(user))
		dispatch(await getSettings())
		dispatch(saveSnackbar('snackbars.deletedSuccess'))
		dispatch({
			type: getDashboards,
			payload: ds
		})
	}
}
export const reset = () => {
	return dispatch => {
		dispatch({
			type: cDash,
			payload: null
		})
		dispatch({
			type: cGraph,
			payload: []
		})
	}
}
export const importDashboard = (iDash) => {
	return async (dispatch, getState) => {
		let user, newD = {}
		user = getState().settings.user
		newD = iDash
		newD.id = generateID(iDash.name)
		//check for update
		// if (user.aux.senti.dashboards.findIndex(f => f.id === iDash.id)) {
		// 	user.aux.senti.dashboards[user.aux.senti.dashboards.findIndex(f=> f.id === iDash.id)] =
		// }
		user.aux.senti.dashboards.push(newD)
		dispatch(saveOnServ(user))
		dispatch(await getSettings())
		dispatch(saveSnackbar('snackbars.importedSuccess'))
	}
}
export const saveDashboard = (edit) => {
	return async (dispatch, getState) => {
		let user, newD = {}
		let graphs = []
		user = getState().settings.user
		newD = getState().dsSystem.cDash
		graphs = getState().dsSystem.cGraphs
		newD.graphs = graphs
		if (edit) {
			user.aux.senti.dashboards[user.aux.senti.dashboards.findIndex(f => f.id === newD.id)] = newD
		}
		else {
			user.aux.senti.dashboards.push(newD)
		}
		// dispatch()
		dispatch(saveOnServ(user))
		dispatch(await getSettings())
		dispatch(saveSnackbar('snackbars.createdSuccess'))

	}
}

export const setLayout = (l) => {
	return (dispatch, getState) => {
		let graphs = []
		// let g = {}
		graphs = getState().dsSystem.cGraphs
		graphs.forEach(g => {
			let grid = l[l.findIndex(r => r.i === g.id)]
			g.grid = grid
		})
		dispatch({
			type: cGraph,
			payload: graphs
		})
	}
}

export const resetCreateDash = () => {
	return dispatch => {
		dispatch({
			type: cDash,
			payload: null,
		})
		dispatch({
			type: cGraph,
			payload: []
		})
	}
}
export const resetEditDash = () => {
	return dispatch => {
		dispatch({
			type: eDash,
			payload: null,
		})
		dispatch({
			type: cGraph,
			payload: []
		})
	}
}
const initialState = {
	dashboards: [],
	dashboard: null,
	gotDashboardData: true,
	graphs: [],
	cDash: null,
	cGraphs: [],
	saved: false
}

const setState = (key, payload, state) => Object.assign({}, state, { [key]: payload })

export const dsSystem = (state = initialState, { type, payload }) => {
	switch (type) {
		case snackBar:
			return setState('saved', payload, state)
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
