import moment from 'moment'

const ChangeDate = 'changeDate'

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
	id: 2,
	to: moment(),
	from: moment().subtract(7, 'days'),
	timeType: 2
}

export const dateTime = (state = initialState, { type, payload }) => {
	switch (type) {

		case ChangeDate:
			return { ...state, ...payload }
		
		default:
			return state
	}
}
