const setACL = 'setAccessLevel'

const initialState = {
	accessLevel: {}
}

export const settings = (state = initialState, { type, payload }) => {
	switch (type) {
		// case SavedCookies:
		// 	return Object.assign({}, state, { savedCookies: action.savedCookies })
		case setACL:
			return Object.assign({}, state, { accessLevel: payload })
		default:
			return state
	}

}