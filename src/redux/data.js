import { set, get } from 'variables/storage';

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
		dispatch({
			type: setusers,
			payload: users
		})
	}
} 
export const setOrgs = () => {
	return dispatch => {
		let orgs = get('orgs')
		dispatch({
			type: setorgs,
			payload: orgs
		})
	}
} 
export const setDevices = () => {
	return dispatch => {
		let devices = get('devices')
		dispatch({
			type: setdevices,
			payload: devices
		})
	}
} 
export const setProjects = () => {
	return dispatch => {
		let projects = get('projects')
		dispatch({
			type: setprojects,
			payload: projects
		})
	}
} 
export const setCollections = () => {
	return dispatch => {
		let collections = get('collections')
		dispatch({
			type: setcollections,
			payload: collections
		})
	}
} 
export const getUsers = (users) => {
	return dispatch => {
		set('users', users)
		dispatch({
			type: gotusers,
		})
	}
}
export const getOrgs = (orgs) => {
	return dispatch => {
		set('orgs', orgs)
		dispatch({
			type: gotorgs,
		})
	}
}
export const getDevices = (devices) => {
	return dispatch => {
		set('devices', devices)
		dispatch({
			type: gotdevices,
		})
	}
}
export const getProjects = (projects) => {
	return dispatch => {
		set('projects', projects)
		dispatch({
			type: gotprojects,
		})
	}
}
export const getCollections = (collections) => {
	return dispatch => {
		set('collections', collections)
		dispatch({
			type: gotcollections,
		})
	}
}
const initialState = {
	users: false,
	orgs: false,
	devices: false,
	projects: false,
	collections: false,
}

export const data = (state = initialState, { type, payload }) => {
	switch (type) {
		case gotusers: 
			return Object.assign({}, state, { gotusers: true })
		case gotorgs: 
			return Object.assign({}, state, { gotorgs: true })		
		case gotdevices: 
			return Object.assign({}, state, { gotdevices: true })		
		case gotprojects: 
			return Object.assign({}, state, { gotprojects: true })
		case gotcollections: 
			return Object.assign({}, state, { gotcollections: true })		
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
