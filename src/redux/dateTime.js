import moment from 'moment'

const ChangeDate = 'changeDate'
const changeCompares = 'changeCompares'

export const hideCompare = (cId) => { 
	return (dispatch, getState) => {
		console.log('cId', cId)
		let newCompares = []
		newCompares.push(...getState().dateTime.compares)
		let c = newCompares.findIndex(c => c.id === cId)
		newCompares[c] = { ...newCompares[c], display: !newCompares[c].display }
		console.log('cId', c, newCompares[c])
		dispatch({
			type: changeCompares,
			payload: newCompares
		})
	}
}
export const removeCompares = () => {
	return (dispatch) => {
		dispatch({
			type: changeCompares,
			payload: []
		})
	}
}
export const removeCompare = (cId) => { 
	return (dispatch, getState) => { 
		let newCompares = []
		newCompares.push(...getState().dateTime.compares)
		newCompares = newCompares.filter(c => c.id !== cId)
		dispatch({
			type: changeCompares,
			payload: newCompares
		})
	}
}

export const addCompare = (compare) => { 
	return (dispatch, getState) => {
		let newCompares = []
		compare.forEach((c, i) => c.id = getState().dateTime.compares.length + i)
		newCompares.push( ...getState().dateTime.compares,  ...compare)
		dispatch({
			type: changeCompares,
			payload: newCompares
		})

	}
}
export const changeDate = (menuId, to, from, timeType, id) => { 
	return (dispatch, getState) => {
		let periods = []
		periods = [...getState().dateTime.periods]
		let c = periods.findIndex(f => f.id === id)
		periods[c] = { ...periods[c],
			menuId, to, from, timeType, 
		}
		dispatch({
			type: ChangeDate,
			payload: periods
		})
	}
}
const initialState = {
	periods: [{
		id: 0,
		menuId: 0,
		to: moment(),
		from: moment().startOf('day'),
		timeType: 0
	}, {
		id: 1,
		menuId: 2,
		to: moment(),
		from: moment().subtract(7, 'days'),
		timeType: 2
	}],
	compares: [],
	id: 2,
	to: moment(),
	from: moment().subtract(7, 'days'),
	timeType: 2
}

export const dateTime = (state = initialState, { type, payload }) => {
	switch (type) {
		case changeCompares:
			return Object.assign({}, state, { compares: payload })
		case ChangeDate:
			return Object.assign({}, state, { periods: payload })
		
		default:
			return state
	}
}
