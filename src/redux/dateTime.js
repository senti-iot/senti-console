import moment from 'moment'

const ChangeDate = 'changeDate'
const changeCompares = 'changeCompares'

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
		newCompares.push(...getState().dateTime.compares, compare)
		dispatch({
			type: changeCompares,
			payload: newCompares
		})

	}
}
export const changeDate = (id, to, from, timeType) => { 
	return (dispatch, getState) => { 
		dispatch({
			type: ChangeDate,
			payload: {
				id, to, from, timeType
			}
		})
	}
}
const initialState = {
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
			return Object.assign({}, state,  { ...payload })
		
		default:
			return state
	}
}
