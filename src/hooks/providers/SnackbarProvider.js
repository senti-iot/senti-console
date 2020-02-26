import React, { useState } from 'react'
import { Snackbar, IconButton } from '@material-ui/core'
import { Close } from 'variables/icons'
import useLocalization from 'hooks/useLocalization/useLocalization'
import { useSelector } from 'react-redux'

export const SProvider = React.createContext(null)
SProvider.displayName = 'Snackbar'

const SnackbarProvider = ({ children }) => {
	const [sOpen, setSOpen] = useState(false)
	const [sMessage, setSMessage] = useState('')
	const [sOpt, setSOpt] = useState(null)
	const snackbarLocation = useSelector(s => s.settings.snackbarLocation)
	const t = useLocalization()

	let queue = []
	const s = (sId, sOpt) => {
		queue.push({ sId, sOpt })
		if (sOpen) {
			setSOpen(false)
			setTimeout(() => {
				processQueue()
			}, 500)
		} else {
			processQueue()
		}
	}
	const processQueue = () => {
		if (queue.length > 0) {
			let msg = queue.shift()
			setSMessage(msg.sId)
			setSOpt(msg.sOpt)
			setSOpen(true)
		}
	}
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
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: snackbarLocation }}
				open={sOpen}
				onClose={sClose}
				onExited={handleNextS}
				ContentProps={{
					'aria-describedby': 'message-id',
				}}
				ClickAwayListenerProps={{
					mouseEvent: false,
					touchEvent: false
				}}
				autoHideDuration={3000}
				message={<span>{sMessage ? t(sMessage, sOpt) : null}</span>}
				action={<IconButton color={'primary'} size={'small'} onClick={sClose} >
					<Close />
				</IconButton>}
			/>
		</SProvider.Provider>

	)
}

export default SnackbarProvider
