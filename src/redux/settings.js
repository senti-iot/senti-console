

const THEME = "THEME"
const TRP = "TABLE_ROWS_PER_PAGE"
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
		default:
			return state
	}
}