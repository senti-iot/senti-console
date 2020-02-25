import React from 'react'
import { ItemGrid, DSelect } from 'components';
import { Grid, ListItem, List, ListItemText, withStyles, Collapse } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import DInput from 'components/CustomInput/DInput';
import { useLocalization } from 'hooks'

// @Andrei
const CalibrateDeviceSettings = props => {
	const t = useLocalization()
	const changeCalType = e => {
		props.changeCalType(e.target.value)
	}
	const changeMinutesCount = e => props.changeTCount(e.target.value)
	// const changeCalNotif = e => props.changeCalNotif(e.target.value)
	const changeCount = val => props.changeCount(val)

	const { classes } = props
	const { calibration, count, tcount } = props
	const calibrations = [
		{ value: 0, label: t('settings.calibration.time') },
		{ value: 1, label: t('settings.calibration.count') }
	]
	const counts = [200, 10, 20, 30, 40, 50]
	const minutes = [
		{ value: 300, label: `5 ${t('settings.calibration.minutes')}` },
		{ value: 600, label: `10 ${t('settings.calibration.minutes')}` },
		{ value: 1200, label: `20 ${t('settings.calibration.minutes')}` },
		{ value: 1800, label: '30 ' + t('settings.calibration.minutes') }
	]
	return (
		<Grid container>
			<List className={classes.list}>
				<ListItem divider>
					<ItemGrid container zeroMargin noPadding alignItems={'center'}>
						<ListItemText>{t('settings.calibration.text')}</ListItemText>
						<DSelect menuItems={calibrations} value={calibration} onChange={changeCalType} />
					</ItemGrid>
				</ListItem>
				<Collapse in={calibration === 1 ? true : false} style={{ width: '100%' }}>
					<ListItem divider>
						<ItemGrid container zeroMargin noPadding alignItems={'center'}>
							<ListItemText>{t('settings.calibration.byCount')}</ListItemText>
							<DInput menuItems={counts} value={count} onChange={changeCount} />
						</ItemGrid>
					</ListItem>
				</Collapse>
				<Collapse in={calibration === 0 ? true : false} style={{ width: '100%' }}>
					<ListItem divider>
						<ItemGrid container zeroMargin noPadding alignItems={'center'}>
							<ListItemText>{t('settings.calibration.byTime')}</ListItemText>
							<DSelect menuItems={minutes} value={tcount} onChange={changeMinutesCount} />
						</ItemGrid>
					</ListItem>
				</Collapse>
			</List>
		</Grid>
	)
}

export default withStyles(settingsStyles)(CalibrateDeviceSettings)