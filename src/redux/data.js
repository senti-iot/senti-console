/* eslint-disable eqeqeq */
import { set, get } from 'variables/storage';
import { getAllUsers, getUser } from 'variables/dataUsers';
import { getAllProjects, getProject } from 'variables/dataProjects';
import { getAllDevices, getDevice } from 'variables/dataDevices';
import { getAllOrgs, getOrg } from 'variables/dataOrgs';
import { getAllCollections, getCollection } from 'variables/dataCollections';
import { colors } from 'variables/colors';
import { hist } from 'App';
/**
 * Special functions
 */
//eslint-ignore
function compare (obj1, obj2) {
	//Loop through properties in object 1
	if (obj1 === undefined || obj2 === undefined) {
		return false
	}
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!compare(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				// eslint-disable-next-line eqeqeq
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	// eslint-disable-next-line no-redeclare
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};
/**
 * Actions
 */
const gotusers = 'GotUsers'
const gotorgs = 'GotOrgs'
const gotdevices = 'GotDevices'
const gotprojects = 'GotProjects'
const gotcollections = 'GotCollections'

const gotProject = 'GotProject'
const gotCollection = 'GotCollection'
const gotDevice = 'GotDevice'
const gotOrg = 'GotOrg'
const gotUser = 'GotUser'

const setusers = 'SetUsers'
const setorgs = 'SetOrgs'
const setdevices = 'SetDevices'
const setprojects = 'SetProjects'
const setcollections = 'SetCollections'

const setProject = 'SetProject'
const setCollection = 'SetCollection'
const setDevice = 'SetDevice'
const setOrg = 'SetOrganisation'
const setUser = 'SetUser'

export const getUserLS = async (id) => {
	return async dispatch => {
		let user = get('user.' + id)
		if (user) {
			dispatch({
				type: setUser,
				payload: user
			})
			dispatch({
				type: gotUser,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotUser,
				payload: false,
			})
			dispatch({
				type: setUser,
				payload: null
			})
		}
		await getUser(id).then(rs => {
			if (!compare(user, rs)) {
				user = { ...rs }
				dispatch({
					type: setUser,
					payload: user
				})
				set('user.' + id, user)
				dispatch({
					type: gotUser,
					payload: true
				})
			}
		})
	}
}
export const getDeviceLS = async (id) => {
	return async dispatch => {
		let device = get('device.' + id)
		if (device) {
			dispatch({
				type: setDevice,
				payload: device
			})
			dispatch({
				type: gotDevice,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotDevice,
				payload: false,
			})
			dispatch({
				type: setDevice,
				payload: null
			})
		}
		await getDevice(id).then(async rs => {
			if (!compare(device, rs)) {
				let collection = await getCollection(rs.dataCollection)
				device = { ...rs, dataCollection: collection }
				dispatch({
					type: setDevice,
					payload: device
				})
				set('device.' + id, device)
				dispatch({
					type: gotDevice,
					payload: true
				})
			}
		})
	}
}
export const getOrgLS = async (id) => {
	return async dispatch => {
		let org = get('org.' + id)
		if (org) {
			dispatch({
				type: setOrg,
				payload: org
			})
			dispatch({
				type: gotOrg,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotOrg,
				payload: false,
			})
			dispatch({
				type: setOrg,
				payload: null
			})
		}
		await getOrg(id).then(rs => {
			if (!compare(org, rs)) {
				org = { ...rs }
				dispatch({
					type: setOrg,
					payload: org
				})
				set('org.' + id, org)
				dispatch({
					type: gotOrg,
					payload: true
				})
			}
		})
	}
}
export const getCollectionLS = async (id) => {
	return async dispatch => {
		let collection = get('collection.' + id)
		if (collection) {
			dispatch({
				type: setCollection,
				payload: collection
			})
			dispatch({
				type: gotCollection,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotCollection,
				payload: false
			})
			dispatch({
				type: setCollection,
				payload: null
			})
		}
		await getCollection(id).then(rs => {
			if (!compare(collection, rs)) {
				collection = {
					...rs,
				}
				dispatch({
					type: setCollection,
					payload: collection
				})
				set('collection.' + id, collection)
				dispatch({
					type: gotCollection,
					payload: true
				})
			}
		})
	}
}
export const getProjectLS = async (id) => {
	return async dispatch => {
		let project = get('project.' + id)
		if (project) {
			dispatch({
				type: setProject,
				payload: project
			})
			dispatch({
				type: gotProject,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotProject,
				payload: false
			})
			dispatch({
				type: setProject,
				payload: null
			})
		}
		await getProject(id).then(rs => {
			if (rs) {
				if (!compare(project, rs)) {
					project = {
						...rs,
						dataCollections: rs.dataCollections.map((dc, i) => {
							return ({ ...dc, color: colors[i] })}),
						devices: rs.dataCollections.filter(dc => dc.activeDevice ? true : false).map((dc, i) => dc.activeDevice ? { ...dc.activeDevice, color: colors[i] } : null)
					}
					dispatch({
						type: setProject,
						payload: project
					})
					set('project.' + id, project)
					dispatch({
						type: gotProject,
						payload: true
					})
				}
			}
			else {
				hist.push('/404')
			}
		})
		
	}
}

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
		case setCollection: 
			return Object.assign({}, state, { collection: payload })
		case gotCollection: 
			return Object.assign({}, state, { gotCollection: payload })
		case setDevice: 
			return Object.assign({}, state, { device: payload })
		case gotDevice: 
			return Object.assign({}, state, { gotDevice: payload })
		case setOrg: 
			return Object.assign({}, state, { org: payload })
		case gotOrg: 
			return Object.assign({}, state, { gotOrg: payload })
		case setUser: 
			return Object.assign({}, state, { user: payload })
		case gotUser: 
			return Object.assign({}, state, { gotUser: payload })
		case setProject: 
			return Object.assign({}, state, { project: payload })
		case gotProject: 
			return Object.assign({}, state, { gotProject: payload })
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
