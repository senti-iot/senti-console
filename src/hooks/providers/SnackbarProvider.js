import React, { useState } from 'react'

export const SProvider = React.createContext(null)
SProvider.displayName = 'Snackbar'
const SnackbarProvider = ({ children }) => {
	// const [locState, locDispatch] = useReducer(localization, initialLocState)
	const [sOpen, setSOpen] = useState(false)
	const [sMessage, setSMessage] = useState('')
	const [sOpt, setSOpt] = useState(null)

	let queue = []
	const s = (sId, sOpt) => {
		queue.push({ sId, sOpt })
		if (sOpen) {
			setSOpen(false);
		} else {
			processQueue();
		}
	}
	const processQueue = () => {
		if (queue.length > 0) {
			let msg = queue.shift()
			setSMessage(msg.sId)
			setSOpt(msg.sOpt)
			setSOpen(true)
		}
	};
	const sClose = () => {
		setSOpen(false)

	}
	const handleNextS = () => {
		processQueue()
	}

	return (
		<SProvider.Provider value={{
			s: s,
			sId: sMessage,
			sOpt: sOpt,
			sOpen: sOpen,
			sClose: sClose,
			handleNextS: handleNextS,
		}}>
			{children}
		</SProvider.Provider>

	)
}

export default SnackbarProvider
