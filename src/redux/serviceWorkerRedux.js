
// CONSTANTS
export const UPDATE_SERVICEWORKER = 'UPDATE_SERVICEWORKER'
const CloseIsBeta = "CloseIsBetaBanner"
export function closeIsBeta() {
	return {
		type: CloseIsBeta
	}
}
export function updateServiceworker() {
	return {
		type: UPDATE_SERVICEWORKER
	}
}

const initialState = {
	serviceWorkerUpdated: false,
	isBeta: process.env.REACT_APP_ISBETA ? process.env.REACT_APP_ISBETA : false
}
export const serviceWorkerReducer = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_SERVICEWORKER: {
			return {
				...state,
				serviceWorkerUpdated: true
			}
		}
		case CloseIsBeta:
			return {
				...state,
				isBeta: false
			}
		default:
			return state
	}
}
