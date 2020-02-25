import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { resetSettings } from 'redux/settings';
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({

// })

// const mapDispatchToProps = dispatch => ({
// 	resetSettings: () => dispatch(resetSettings())
// })

const ResetSettingsModal = props => {
	const t = useLocalization()
	const dispatch = useDispatch()


	const handleClose = () => props.handleClose()
	const handleYes = () => {
		dispatch(resetSettings())
		props.handleClose(true)
	}

	const { open, classes } = props
	return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="simple-dialog-title" >
			<DialogTitle disableTypography id="simple-dialog-title">{t('settings.reset.resetSettings')}</DialogTitle>
			<DialogContent>
				{t('settings.reset.message')}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>
					{t('actions.no')}
				</Button>
				<Button onClick={handleYes} className={classes.red}>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ResetSettingsModal
