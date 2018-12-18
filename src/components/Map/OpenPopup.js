import React, { Component } from 'react'
import { Paper, Button, withStyles } from '@material-ui/core';
import { ItemGrid, ItemG, Caption, Info, WeatherIcon } from 'components';
import { Link } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import { red, green, yellow } from '@material-ui/core/colors'
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons';

const styles = theme => ({
	paper: {
		boxShadow: "none"
	},
	redSignal: {
		color: red[700]
	},
	greenSignal: {
		color: green[700]
	},
	yellowSignal: {
		color: yellow[600]
	},
})

class OpenPopup extends Component {
	renderIcon = (status) => {
		const { classes, t } = this.props
		switch (status) {
			case 1:
				return <div title={t('devices.status.yellow')}><SignalWifi2Bar className={classes.yellowSignal} /></div>
			case 2:
				return <div title={t('devices.status.green')}><SignalWifi2Bar className={classes.greenSignal} /></div>
			case 0:
				return <div title={t('devices.status.red')}><SignalWifi2Bar className={classes.redSignal} /></div>
			default:
				return <div title={t('devices.status.red')}> <SignalWifi2BarLock className={classes.redSignal} /></div>
		}
	}
	render() {
		const { classes, m, t } = this.props
		return <Paper className={classes.paper}>
			<ItemGrid container noMargin>
				<ItemG xs={6}>
					<Caption>{t('devices.fields.id')}</Caption>
					<Info>
						{m.id}
					</Info>
				</ItemG>
				<ItemG xs={6}>
					<Caption>{t('devices.fields.status')}</Caption>
					{this.renderIcon(m.liveStatus)}
				</ItemG>
				{m.name ?
					<ItemG xs={12}>
						<Caption>{t('devices.fields.name')}</Caption>
						<Info>{m.name}</Info>
					</ItemG>
					: null}
				{m.weather ? <ItemG xs={12} container>
					<ItemG xs={3}>
						<WeatherIcon icon={m.weather.currently.icon} />
					</ItemG>
					<ItemG xs={9}>
						<Caption>{t('devices.fields.weather')}</Caption>
						<Info>
							{m.weather.currently.summary}
						</Info>
					</ItemG>
				</ItemG> : null}
				<ItemG xs={6}>
					<Caption>{t('devices.fields.temp')}</Caption>
					<Info>{m.temperature} &#8451;</Info>
				</ItemG>
				<ItemG xs={12}>
					<Caption>{t('devices.fields.address')}</Caption>
					<Info>{m.address ? m.address : t('devices.noAddress')}</Info>
				</ItemG>
				{/* <ItemG xs={12}>
					<Caption>{t('devices.liveCount')}</Caption>
					<Info>{this.state.liveCount}</Info>
				</ItemG> */}
				<ItemG xs={12}>
					<Button variant={'text'} color={'primary'} component={Link} to={`/device/${m.id}`}>
						{/* <NavLink to={`/device/${m.id}`}> */}
						{t('menus.seeMore')}
						{/* </NavLink> */}
					</Button>
				</ItemG>
			</ItemGrid>
		</Paper>

	}
}

export default withLocalization()(withStyles(styles)(OpenPopup))
