import { getListPrivileges, getPrivilege } from 'variables/dataAuth'

const setACL = 'setAccessLevel'
const setRes = 'setPrivileges'
const setPrivs = 'setPrivilege'

const initialState = {
	accessLevel: {},
	resources: {},
	userPrivilege: {},
}
export const getPriv = (uuid, pList) => {
	return async (dispatch, getState) => {
		let accessLevel = getState().auth.accessLevel
		let privs = await getPrivilege(uuid, pList)
		let nAccess = { ...accessLevel }
		nAccess.privileges = { ...nAccess.privileges, ...privs }
		dispatch({
			type: setPrivs,
			payload: nAccess.privileges
		})
	}
}
export const getPrivList = (uuids, pList) => {
	return async (dispatch, getState) => {
		let privs = await getListPrivileges(uuids, pList)
		dispatch({
			type: setRes,
			payload: privs
		})
	}
}
export const auth = (state = initialState, { type, payload }) => {
	console.log(state)
	switch (type) {
		case setPrivs:
			return Object.assign({}, state, { userPrivilege: payload })
		case setRes:
			return Object.assign({}, state, { resources: { ...state.resources, ...payload } })
		case setACL:
			return Object.assign({}, state, { accessLevel: payload })
		default:
			return state
	}

}