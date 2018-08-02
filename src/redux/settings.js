

const LANG = "LANG"

export const changeLang = (code) => {
	return {
		type: LANG,
		code
	}
}
let initialState = {
	language: "dk"
}
export const settings = (state = initialState, action) => {
	switch (action.type) {
		case LANG:
			return Object.assign({}, state, {
				language: action.code
			})
		default:
			return state
	}
}