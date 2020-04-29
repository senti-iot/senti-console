import React from 'react'
// import { localization, initialLocState } from 'Redux/localization';
import { useSelector } from 'react-redux'
import { getPrivilege } from 'variables/dataAuth'

export const AuthProv = React.createContext(null)
AuthProv.displayName = 'PrivilegeProvider'

const AuthProvider = ({ children }) => {
	//Hooks

	//Redux
	const resources = useSelector(s => s.auth.resources)
	//State

	//Const

	//useCallbacks

	//useEffects

	//Handlers
	const hasAccess = async (uuid, perm) => {
		if (resources[uuid]) {
			return resources[uuid][perm]
		}
		else {
			return false
		}
	}
	return (
		<AuthProv.Provider value={hasAccess}>
			{children}
		</AuthProv.Provider>

	)
}

export default React.memo(AuthProvider)
