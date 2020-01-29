import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar, Button, withStyles } from '@material-ui/core';
import ItemG from 'components/Grid/ItemG';
import withLocalization from 'components/Localization/T';
import { acceptCookiesFunc } from 'redux/settings';
import CookiesDialog from './CookiesDialog';
import withSnackbar from 'components/Localization/S';
import { finishedSaving } from 'redux/settings';
import { useSnackbar, useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	cookies: state.settings.cookies,
// 	saved: state.settings.saved
// })
// const mapDispatchToProps = dispatch => ({
// 	acceptCookies: async (val) => dispatch(await acceptCookiesFunc(val)),
// 	finishedSaving: () => dispatch(finishedSaving())
// })

const styles = theme => ({
	p: {
		marginBottom: theme.spacing(1)
	},
	title: {
		fontWeight: 500
	}
})

const Cookies = props => {
	const dispatch = useDispatch()
	const cookies = useSelector(state => state.settings.cookies)
	const saved = useSelector(state => state.settings.saved)

	// hopefully these hooks are correct
	const t = useLocalization()
	const s = useSnackbar().s

	const [open, setOpen] = useState(false)
	const [showSnackBar, setShowSnackBar] = useState(true)

	useEffect(() => {
		s('snackbars.settingsSaved')
		dispatch(finishedSaving())
	}, [dispatch, s, saved])
	// const componentDidUpdate = (prevProps, prevState) => {
	// 	if (saved) {
	// 		s('snackbars.settingsSaved')
	// 		dispatch(finishedSaving()
	// 	}
	// }

	const handleAcceptCookies = async () => {
		handleClose()
		// props.acceptCookies(true)
		dispatch(await acceptCookiesFunc(true))
	}
	const handleOpen = () => {
		setOpen(true)
		setShowSnackBar(false)
		// this.setState({ open: true, showSnackBar: false });
	};
	const handleClose = () => {
		setOpen(false)
		showSnackBar(true)
		// this.setState({ open: false, showSnackBar: true });
	};
	const renderCookiesPrivacy = () => {
		const { classes } = props
		return <CookiesDialog
			open={open}
			handleClose={handleClose}
			t={t}
			classes={classes}
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

export default withLocalization()(withStyles(styles)(withSnackbar()(Cookies)))
