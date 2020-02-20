import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar, Button } from '@material-ui/core';
import ItemG from 'components/Grid/ItemG';
import { acceptCookiesFunc } from 'redux/settings';
import CookiesDialog from './CookiesDialog';
import { finishedSaving } from 'redux/settings';
import { useSnackbar, useLocalization } from 'hooks';


const Cookies = props => {
	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()
	const s = useSnackbar().s

	//Redux
	const cookies = useSelector(state => state.settings.cookies)
	const saved = useSelector(state => state.settings.saved)

	//State
	const [open, setOpen] = useState(false)
	const [showSnackBar, setShowSnackBar] = useState(true)

	//Const

	//useCallbacks

	//useEffects
	useEffect(() => {
		if (saved) {
			s('snackbars.settingsSaved')
			dispatch(finishedSaving())
		}
	}, [dispatch, s, saved])

	//Handlers
	//Test
	//Test2


	const handleAcceptCookies = async () => {
		handleClose()
		dispatch(await acceptCookiesFunc(true))
	}
	const handleOpen = () => {
		setOpen(true)
		setShowSnackBar(false)
	}
	const handleClose = () => {
		setOpen(false)
		showSnackBar(true)
	}

	const renderCookiesPrivacy = () => {
		return <CookiesDialog
			open={open}
			handleClose={handleClose}
			t={t}
			handleAcceptCookies={handleAcceptCookies} />
	}

	return (
		<Fragment>
			<Snackbar
				open={!cookies && showSnackBar}
				ContentProps={{
					style: { width: '100%' },
					'aria-describedby': 'message-id',
				}}
				message={<span id="message-id">{t('dialogs.cookies.message.snackbar')}</span>}
				action={
					<ItemG container justify={'space-between'}>
						<Button color={'primary'} size={'small'} onClick={handleAcceptCookies}>
							{t('actions.accept')}
						</Button>
						<Button color={'primary'} size={'small'} onClick={handleOpen}>
							{t('actions.readMore')}
						</Button>
					</ItemG>
				}
			/>
			{renderCookiesPrivacy()}
		</Fragment>

	)
}

export default Cookies
