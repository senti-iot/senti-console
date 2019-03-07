import React, { Fragment } from 'react'
import { Button, Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import { T } from 'components';
const PrivacyDialog = (props) => {
	const { open, handleClose, t, classes, readOnly } = props
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			scroll="paper"
			aria-labelledby="scroll-dialog-title"
		>
			<DialogTitle disableTypography id="scroll-dialog-title">
				<T reversed variant={'h6'}>
					{t('Privacy.title')}
				</T>
			</DialogTitle>
			<DialogContent>
				{/* <T className={classes.p + ' ' + classes.title} variant={'h5'}>{t('Privacy.title')}</T> */}
				<T className={classes.p} variant={'h6'}>{t('Privacy.subtitle')}</T>
				<T className={classes.p}>{t('cookies.p.1')}</T>
				<T className={classes.p}>{t('cookies.p.2')}</T>
				<T className={classes.p}>{t('cookies.p.3')}</T>
				<T className={classes.p}>{t('cookies.p.4')}</T>
				<T className={classes.p}>{t('cookies.p.5')}</T>
				<T className={classes.p}>{t('cookies.p.6')}</T>
				<T>{t('cookies.p.7')}</T>
				<T className={classes.p}>
					<a target="_blank" rel="noopener noreferrer" href={'https://policies.google.com/privacy '}>https://policies.google.com/privacy.</a>
				</T>
				<T className={classes.p}>
					{`${t('cookies.p.8')} `}
					<a target="_blank" rel="noopener noreferrer" href={'https://aboutcookies.org/'}>https://aboutcookies.org/</a>
					{`. ${t('cookies.p.9')}`}
				</T>
				<T className={classes.p}>{t('cookies.p.10')}</T>
			</DialogContent>
			<DialogActions>
				{readOnly ? <Button color={'primary'} onClick={handleClose}>OK</Button>
					:
					<Fragment>
						{/* <Button onClick={handleClose} color="primary">
							{t('actions.cancel')}
						</Button> */}
						<Button onClick={handleClose} color="primary">
							{t('actions.accept')}
						</Button>
					</Fragment>
				}
			</DialogActions>
		</Dialog>
	)
}

export default PrivacyDialog
