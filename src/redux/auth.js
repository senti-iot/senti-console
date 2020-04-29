import { getListPrivileges } from 'variables/dataAuth'

const setACL = 'setAccessLevel'
const setRes = 'setPrivileges'

const initialState = {
	accessLevel: {},
	resources: {}
}
export const getPrivList = (uuids, pList) => {
	return async (dispatch, getState) => {
		let currentSet = { ...getState().auth.resources }
		let privs = await getListPrivileges(uuids, pList)
		currentSet = { ...currentSet, ...privs }
		dispatch({
			type: setRes,
			payload: currentSet
		})
	}
}
export const auth = (state = initialState, { type, payload }) => {
	switch (type) {
		case setRes:
			return Object.assign({}, state, { resources: payload })
		case setACL:
			return Object.assign({}, state, { accessLevel: payload })
		default:
			return state
	}

}