import React, { Fragment } from 'react'
import { Button, Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import { T, Caption } from 'components';
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
					{t('privacy.title')}
				</T>
			</DialogTitle>
			<DialogContent>				
				<T b>{t('privacy.responsible')}</T>
 				<Caption>Senti.Cloud </Caption>
 				<Caption>c/o WebHouse ApS</Caption>
 				<Caption>Alexander Foss Gade 13, 3. th</Caption>
 				<Caption>DK-9000 Aalborg</Caption>
 				<Caption>{t('privacy.contactEmail')}privacy@senti.cloud</Caption>
 				<Caption className={classes.p}>CVR-nr. 21221198</Caption>
				<T className={classes.p} b>{t('privacy.subtitle')}</T>
				<T className={classes.p}>{t('privacy.p0')}</T>
				<T className={classes.p}><span style={{ fontWeight: 600 }}>{t('privacy.note')}</span> {`${t('privacy.p1')}`}</T>
				<T className={classes.p}>{t('privacy.p2')}</T>
				<T className={classes.p}>{t('privacy.p3')}</T>
				<T className={classes.p}>{t('privacy.p4')}</T>
				<T className={classes.p}>{t('privacy.p5')}</T>
				<T className={classes.p}>{t('privacy.p6')}</T>
				<T className={classes.p}>{t('privacy.p7')}</T>
				<T className={classes.p}>{t('privacy.p8')}</T>
				<T className={classes.p}>{t('privacy.p9')}</T>
				<T className={classes.p}>{t('privacy.p10')}</T>
				<T b>{t('privacy.b0')}</T>
				<T className={classes.p}>{t('privacy.p11')}</T>
				<T className={classes.p}>{t('privacy.p12')}</T>
				<T b>{t('privacy.b1')}</T>
				<T className={classes.p}>{t('privacy.p13')}</T>
				<T className={classes.p}>{t('privacy.p14')}</T>
				<T className={classes.p}>{t('privacy.p15')}</T>
				<T className={classes.p}>{`${t('privacy.p16')} ${<a target="_blank" rel="noopener noreferrer" href={t('privacy.p16.a')}>{t('privacy.p16.a')}</a>} ${t('privacy.p16.b')}`}</T>
				<T b>{t('privacy.b2')}</T>
				<T className={classes.p}>{t('privacy.p17')}</T>
				<T className={classes.p}>{t('privacy.p18')}</T>
				<T className={classes.p}>{t('privacy.p19')}</T>
				<T className={classes.p}>{t('privacy.p20')}</T>
				<T className={classes.p}>{t('privacy.p21')}</T>
				<T className={classes.p}>{t('privacy.p22')}</T>
				<T className={classes.p}>{`${t('privacy.p23')} ${<a target="_blank" rel="noopener noreferrer" href={t('privacy.p23.a')}>{t('privacy.p23.a')}</a>}`}</T>
				<T b>{t('privacy.b3')}</T>
				<T className={classes.p}>{t('privacy.p24')}</T>
				<T className={classes.p}>{t('privacy.p25')}</T>
				<T className={classes.p}>{t('privacy.p26')}</T>
				<T b>{t('privacy.b4')}</T>
				<T className={classes.p}>{t('privacy.p27')}</T>
				<T b>{t('privacy.b5')}</T>
				<T className={classes.p}>{t('privacy.p28')}</T>
				<T b>{t('privacy.b6')}</T>
				<T className={classes.p}>{t('privacy.p29')}</T>
				<T style={{ fontStyle: 'italic' }} className={classes.p}>{t('privacy.p30')}</T>
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
