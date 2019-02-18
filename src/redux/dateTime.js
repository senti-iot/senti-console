import moment from 'moment'

const changePeriods = 'changeDate'

export const hideShowPeriod = (pId) => { 
	return (dispatch, getState) => {
		let newCompares = []
		newCompares.push(...getState().dateTime.periods)
		let c = newCompares.findIndex(c => c.id === pId)
		newCompares[c] = { ...newCompares[c], hide: !newCompares[c].hide }
		dispatch({
			type: changePeriods,
			payload: newCompares
		})
	}
}
export const resetToDefault = () => {
	return (dispatch) => {
		dispatch({
			type: changePeriods,
			payload: initialState.periods
		})
	}
}
export const removePeriod = (cId) => { 
	return (dispatch, getState) => { 
		let newCompares = []
		newCompares.push(...getState().dateTime.periods)
		newCompares = newCompares.filter(c => c.id !== cId)
		dispatch({
			type: changePeriods,
			payload: newCompares
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
			payload: periods
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
			menuId, to, from, timeType, chartType: id === -1 ? 3 : periods[c].chartType, hide: false
		}
		dispatch({
			type: changePeriods,
			payload: periods
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
	periods: [{
		id: 0,
		menuId: 0,
		to: moment(),
		from: moment().startOf('day'),
		timeType: 0,
		chartType: 3,
		hide: false
	}, {
		id: 1,
		menuId: 2,
		to: moment(),
		from: moment().subtract(7, 'days'),
		timeType: 2,
		chartType: 3,
		hide: false
	}]
}

export const dateTime = (state = initialState, { type, payload }) => {
	switch (type) {
		case changePeriods:
			return Object.assign({}, state, { periods: payload })
		
		default:
			return state
	}
}
