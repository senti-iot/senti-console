import { getHolidays } from 'variables/data';
import { setAll, getAll } from 'variables/storage';
const setDoI = 'setDoI'

export const todayOfInterest = (date) => { 
	return (dispatch, getState) => {
		let DoI = getState().doi.days
		let days = DoI.filter(d => d.date === date && !(d.birthday))
		let birthdays = DoI.filter(d => d.date === date && d.birthday === true)
		return { days, birthdays }
	}
}
export const setDaysOfInterest = (daysOfInterest) => ({
	type: setDoI,
	days: daysOfInterest
})
export const getDaysOfInterest = (lang) => {
	return async (dispatch, getState) => {
		if (getAll('holidays')) {
			dispatch(setDaysOfInterest(getAll('holidays')))
			
		}
		else {
			let days = await getHolidays(lang ? lang : getState().localization.language)
			setAll('holidays', days)
			dispatch(setDaysOfInterest(days))
		}
	} 
}
const initialState = {
	days: []
}

export const doi = (state = initialState, action) => {
	switch (action.type) {

		case setDoI:
			return Object.assign({}, state, { days: [...action.days] })

		default:
			return state
	}
}
