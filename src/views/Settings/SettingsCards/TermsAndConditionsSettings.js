import React, { useState } from 'react'
import { InfoCard, ItemGrid } from 'components';
import { Assignment } from 'variables/icons';
import { Grid, List, ListItem, ListItemText, Button } from '@material-ui/core';
import settingsStyles from 'assets/jss/components/settings/settingsStylesHooks';
import CookiesDialog from 'components/Cookies/CookiesDialog';
import PrivacyDialog from 'components/Cookies/PrivacyDialog';
import ResetSettingsModal from '../SettingsModal/ResetSettingsModal';
import { useHistory } from 'react-router-dom';
import { useLocalization } from 'hooks';

const TermsAndConditions = props => {
	//Hooks
	const history = useHistory()
	const t = useLocalization()
	const classes = settingsStyles()
	//Redux

	//State
	const [openCP, setOpenCP] = useState(false)
	const [openRS, setOpenRS] = useState(false)
	const [openPP, setOpenPP] = useState(false)
	//Const

	//useCallbacks

	//useEffects

	//Handlers


	const handleOpenCP = () => {
		setOpenCP(true)
	}
	const handleCloseCP = () => {
		setOpenCP(false)
	}
	const handleOpenPP = () => {
		setOpenPP(true)
	}
	const handleClosePP = () => {
		setOpenPP(false)
	}
	const handleOpenRS = () => {
		setOpenRS(true)
	}
	const handleCloseRS = (redirect) => {
		setOpenRS(false)
		if (redirect) {
			history.push('/')
		}
	}

	return (
		<InfoCard
			noExpand
			avatar={<Assignment />}
			title={t('settings.t&c.title')}
			content={
				<Grid container>
					<CookiesDialog open={openCP} handleClose={handleCloseCP} t={t} readOnly />
					<PrivacyDialog open={openPP} handleClose={handleClosePP} t={t} readOnly />
					<ResetSettingsModal open={openRS} handleClose={handleCloseRS} t={t} classes={classes} />
					<List className={classes.list}>
						<ListItem divider>
							<ItemGrid container zeroMargin noPadding alignItems={'center'}>
								<ListItemText>{t('settings.t&c.cookiesPolicy')}</ListItemText>
								<Button color={'primary'} onClick={handleOpenCP}>{t('actions.read')}</Button>
							</ItemGrid>
						</ListItem>
						<ListItem divider>
							<ItemGrid container zeroMargin noPadding alignItems={'center'}>
								<ListItemText>{t('settings.t&c.privacyPolicy')}</ListItemText>
								<Button color={'primary'} onClick={handleOpenPP}>{t('actions.read')}</Button>
							</ItemGrid>
						</ListItem>
						<ListItem>
							<ItemGrid container zeroMargin noPadding alignItems={'center'}>
								<ListItemText>{t('settings.reset.resetSettings')}</ListItemText>
								<Button className={classes.red} onClick={handleOpenRS}>{t('settings.reset.restore')}</Button>
							</ItemGrid>
						</ListItem>
					</List>
				</Grid>
			}
		/>
	)

}

export default TermsAndConditions