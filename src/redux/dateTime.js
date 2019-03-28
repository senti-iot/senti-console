import moment from 'moment'

const changePeriods = 'changeDate'
const changeHeatmapDate = 'changeHeatMapDate'
const changeDataT = 'changeDataTable'
const changeHeatData = 'changeHeatData'
const GetSettings = 'getSettings'
const addPeriod = 'chartAddPeriod'
// const removePeriod = 'chartRemovePeriod'
const menuSelect = (p) => { 
	let to, from;
	switch (p.menuId) {
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
export const setDates = (periods) => {
	let newPeriods = periods ? periods : []
	if (newPeriods.length > 0)
		newPeriods.forEach(p => { 
			let toFrom = menuSelect(p)
			p.from = toFrom.from
			p.to = toFrom.to
		})
	return newPeriods
}
export const storeHeatData = (heatData) => { 
	return dispatch => { 
		dispatch({
			type: changeHeatData,
			periods: heatData
		})
	}
}
export const changeDataTable = (period) => { 
	return (dispatch) => { 
		dispatch({
			type: changeDataT,
			periods: period
		})
	}
}
export const changeHeatMapDate = (menuId, to, from, timeType) => { 
	return (dispatch, getState) => { 
		dispatch({
			type: changeHeatmapDate,
			periods: { menuId, to, from, timeType }
		})
	}
}
export const hideShowPeriod = (pId) => { 
	return (dispatch, getState) => {
		let newCompares = []
		newCompares.push(...getState().dateTime.periods)
		let c = newCompares.findIndex(c => c.id === pId)
		newCompares[c] = { ...newCompares[c], hide: !newCompares[c].hide }
		dispatch({
			type: changePeriods,
			periods: newCompares
		})
	}
}
export const resetToDefault = () => {
	return (dispatch, getState) => {
		dispatch({
			type: changePeriods,
			periods: getState().settings.periods
		})
	}
}
export const removeChartPeriod = (cId) => { 
	return (dispatch, getState) => { 
		let newCompares = []
		newCompares.push(...getState().dateTime.periods)
		newCompares = newCompares.filter(c => c.id !== cId)
		dispatch({
			type: changePeriods,
			periods: newCompares
		})
	}
}

export const changeChartType = (period, chartType) => { 
	return (dispatch, getState) => { 
		let periods = []
		periods = [...getState().dateTime.periods]
		let p = periods.findIndex(f => f.id === period.id)
		periods[p] = { ...period, chartType: chartType }
		dispatch({
			type: changePeriods,
			periods: periods
		})
	}
}
export const changeRawData = p => { 
	return (dispatch, getState) => { 
		let periods = []
		periods = [...getState().dateTime.periods]
		let c = periods.findIndex(f => f.id === p.id)
		periods[c] = {
			...periods[c],
			raw: !periods[c].raw
		}
		dispatch({
			type: changePeriods,
			periods: periods
		})
	}
}
export const changeDate = (menuId, to, from, timeType, id) => { 
	return (dispatch, getState) => {
		let periods = []
		periods = [...getState().dateTime.periods]
		let c
		if (id === -1) {
			c = periods.length
		}
		else { 
			 c = periods.findIndex(f => f.id === id)
		}
		periods[c] = { id: c,
			menuId, to, from, timeType, chartType: id === -1 ? 3 : periods[c].chartType, hide: false, raw: id !== -1 ? periods[c].raw : false
		}
		dispatch({
			type: changePeriods,
			periods: periods
		})
	}
}
/**
 * ChartType: 
 * 0 - Pie
 * 1 - Doughnut
 * 2 - Bar
 * 3 - Line
 */
const initialState = {
	heatData: [],
	heatMap: {
		to: moment(),
		from: moment().subtract(7, 'days'),
		timeType: 2,
		menuId: 3,
	},
	periods: []
}

export const dateTime = (state = initialState, action) => {
	switch (action.type) {

		case GetSettings:
			let periods = setDates(action.settings.periods)
			return Object.assign({}, state, { periods: periods ? periods : state.periods  })
		case changePeriods:
		case addPeriod:
			let newPeriods = setDates(action.periods)
			return Object.assign({}, state, { periods: newPeriods })
		case changeHeatmapDate:
			return Object.assign({}, state, {
				heatMap: {
					...action.periods
				}
			})
		case changeHeatData: 
			return Object.assign({}, state, {
				heatData: action.periods
			})
		default:
			return state
	}
}
