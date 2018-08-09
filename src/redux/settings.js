
const MENULOC = "SIDEBAR_LOCATION"
const THEME = "THEME"
const TRP = "TABLE_ROWS_PER_PAGE"
const CALTYPE = "CALIBRATION_TYPE"

export const changeCalType = t => ({
	type: CALTYPE,
	t
})
export const changeSideBarLoc = loc => {
	return {
		type: MENULOC,
		loc
	}
}
export const changeTRP = (nr) => { 
	return {
		type: TRP,
		nr
	}
}
export const changeTheme = (code) => {
	return {
		type: THEME,
		code
	}
}
let initialState = {
	calibration: 0,
	sideBar: 0,
	theme: "light",
	trp: 10
}
export const settings = (state = initialState, action) => {
	switch (action.type) {
		case THEME:
			return Object.assign({}, state, {
				theme: action.code
			})
		case TRP:
			return Object.assign({}, state, {
				trp: action.nr
			})
		case MENULOC:
			return Object.assign({}, state, {
				sideBar: action.loc
			})
		case CALTYPE:
			return Object.assign({}, state, {
				calibration: action.t
			})
		default:
			return state
	}
}