import { getHolidays } from 'variables/data';

// const getDoI = 'getDoI'
const setDoI = 'setDoI'
export const todayOfInterest = (date) => { 
	return (dispatch, getState) => {
		let DoI = getState().doi.days
		let days = DoI.filter(d => d.date === date)
		return days
	}
}
export const setDaysOfInterest = (daysOfInterest) => ({
	type: setDoI,
	days: daysOfInterest
})
export const getDaysOfInterest = (lang) => {
	return async (dispatch, getState) => {
		let days = await getHolidays(lang ? lang : getState().localization.language)
		dispatch(setDaysOfInterest(days))
	} 
}
const initialState = {
	days: [{ "date": "2018-12-01", "name": "Testing a very long name here today", "nationalHoliday": true }, { "date": "2018-12-01", "name": "Testing a very long name here today", "nationalHoliday": true }, { "date": "2018-12-01", "name": "Testing a very long name here today", "nationalHoliday": true }]
}

export const doi = (state = initialState, action) => {
	switch (action.type) {

		case setDoI:
			return Object.assign({}, state, { days: [...initialState.days, ...action.days] })

		default:
			return state
	}
}
