import { set, get } from 'variables/storage';
import { getAllUsers } from 'variables/dataUsers';
import { getAllProjects } from 'variables/dataProjects';
import { getAllDevices } from 'variables/dataDevices';
import { getAllOrgs } from 'variables/dataOrgs';
import { getAllCollections } from 'variables/dataCollections';

/**
 * Actions
 */
const gotusers = 'GotUsers'
const gotorgs = 'GotOrgs'
const gotdevices = 'GotDevices'
const gotprojects = 'GotProjects'
const gotcollections = 'GotCollections'

const setusers = 'SetUsers'
const setorgs = 'SetOrgs'
const setdevices = 'SetDevices'
const setprojects = 'SetProjects'
const setcollections = 'SetCollections'

export const setUsers = () => {
	return dispatch => {
		let users = get('users')
		if (users)
			dispatch({
				type: setusers,
				payload: users
			})
		else dispatch({
			type: gotusers,
			payload: false
		})
	}
}
export const setOrgs = () => {
	return dispatch => {
		let orgs = get('orgs')
		if (orgs)
			dispatch({
				type: setorgs,
				payload: orgs
			})
		else {
			dispatch({ type: gotorgs, payload: false })
		}
	}
}
export const setDevices = () => {
	return dispatch => {
		let devices = get('devices')
		if (devices)
			dispatch({
				type: setdevices,
				payload: devices
			})
		else {
			dispatch({ type: gotdevices, payload: false })
		}
	}
}
export const setProjects = () => {
	return dispatch => {
		let projects = get('projects')
		if (projects)
			dispatch({
				type: setprojects,
				payload: projects
			})
		else {
			dispatch({ type: gotprojects, payload: false })
		}
		
	}
}
export const setCollections = () => {
	return dispatch => {
		let collections = get('collections')
		if (collections)
			dispatch({
				type: setcollections,
				payload: collections
			})
		else {
			dispatch({ type: gotcollections, payload: false })
		}
	}
}
const renderUserGroup = (user) => {
	if (user.groups) {
		if (user.groups[136550100000143])
			return "users.groups.superUser"
		if (user.groups[136550100000211])
			return "users.groups.accountManager"
		if (user.groups[136550100000225])
			return "users.groups.user"
	}
	return ''
}
export const getAllData = () => {
	return async dispatch => {
		dispatch(getUsers())

		dispatch(getProjects())

		dispatch(getCollections())

		dispatch(getDevices())

		dispatch(getOrgs())
	}
}
export const getUsers = (reload) => {
	return dispatch => {

		getAllUsers().then(rs => {
			let users = rs.map(u => ({ ...u, group: renderUserGroup(u) }))
			// if (reload) {
			// 	dispatch({ type: gotusers, payload: false })
			// }
			set('users', users)
			if (reload) {
				dispatch(setUsers())
			}
			dispatch({ type: gotusers, payload: true })
		})
	}
}
export const getOrgs = (reload) => {
	return dispatch => {
		getAllOrgs().then(rs => {
			// if (reload) {
			// 	dispatch({ type: gotorgs, payload: false })
			// }
			set('orgs', rs)
			if (reload) {
				dispatch(setOrgs())
			}
			dispatch({ type: gotorgs, payload: true })
		})
	}
}
export const getDevices = (reload) => {
	return dispatch => {
		getAllDevices().then(rs => {
			// if (reload) {
			// 	dispatch({ type: gotdevices, payload: false })
			// }
			set('devices', rs)
			if (reload) {
				dispatch(setDevices())
			}
			dispatch({ type: gotdevices, payload: true })
		})
	}
}
export const getProjects = (reload) => {

	return dispatch => {		
		getAllProjects().then(rs => {
			set('projects', rs)			
			if (reload) {
				dispatch(setProjects())
			}
			dispatch({ type: gotprojects, payload: true })
		})

	}
}
export const getCollections = (reload) => {
	return dispatch => {
		getAllCollections().then(rs => {
			set('collections', rs)
			if (reload) {
				dispatch(setCollections())
			}
			dispatch({ type: gotcollections, payload: true })
		})
	}
}
const initialState = {
	users: [],
	orgs: [],
	devices: [],
	projects: [],
	collections: [],
	gotusers: false,
	gotorgs: false,
	gotdevices: false,
	gotprojects: false,
	gotcollections: false,
}

export const data = (state = initialState, { type, payload }) => {
	switch (type) {
		case gotusers:
			return Object.assign({}, state, { gotusers: payload })
		case gotorgs:
			return Object.assign({}, state, { gotorgs: payload })
		case gotdevices:
			return Object.assign({}, state, { gotdevices: payload })
		case gotprojects:
			return Object.assign({}, state, { gotprojects: payload })
		case gotcollections:
			return Object.assign({}, state, { gotcollections: payload })
		case setusers:
			return Object.assign({}, state, { users: payload })
		case setorgs:
			return Object.assign({}, state, { orgs: payload })
		case setdevices:
			return Object.assign({}, state, { devices: payload })
		case setprojects:
			return Object.assign({}, state, { projects: payload })
		case setcollections:
			return Object.assign({}, state, { collections: payload })
		default:
			return state
	}
}
