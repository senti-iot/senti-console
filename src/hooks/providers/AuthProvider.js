import React from 'react'
// import { localization, initialLocState } from 'Redux/localization';
import { useSelector } from 'react-redux'

export const AuthProv = React.createContext(null)
AuthProv.displayName = 'PrivilegeProvider'

const AuthProvider = ({ children }) => {
	//Hooks

	//Redux
	const resources = useSelector(s => s.auth.resources)
	const user = useSelector(s => s.settings.user)
	//State

	//Const

	//useCallbacks

	//useEffects

	//Handlers
	const hasAccessList = (uuids, perm) => {

		console.log(uuids)
		let access = false
		uuids.forEach(async uuid => {
			access = hasAccess(uuid, perm)
		})
		console.log(access)
		return access
	}
	const hasAccess = (uid, perm) => {
		let uuid = uid ? uid : user.uuid
		// if (uuid === user.uuid) {
		// 	return true
		// }
		if (resources[uuid]) {
			return resources[uuid][perm]
		}
		else {
			return false
		}
	}
	return (
		<AuthProv.Provider value={{ hasAccess, hasAccessList }}>
			{children}
		</AuthProv.Provider>

	)
}

export default React.memo(AuthProvider)
