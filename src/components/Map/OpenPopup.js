import React, { Component } from 'react'
import { Paper, Button, withStyles, Typography, Collapse } from '@material-ui/core';
import { ItemG, Caption, Info, WeatherIcon, T } from 'components';
import { Link } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import { red, green, yellow, teal } from '@material-ui/core/colors'
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons';
import moment from 'moment'
import { getWeather } from 'variables/dataDevices';
import { connect } from 'react-redux'

const styles = theme => ({
	paper: {
		boxShadow: "none",
	},
	redSignal: {
		color: red[700],
		width: 30,
		height: 30
	},
	greenSignal: {
		color: green[700],
		width: 30,
		height: 30
	},
	yellowSignal: {
		color: yellow[600],
		width: 30,
		height: 30
	},
})

class OpenPopup extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 weather: null
	  }
	}
	
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
	getWeather = async () => { 
		const { m } = this.props
		if (m.lat && m.long)
			getWeather({ lat: m.lat, long: m.long },
				moment(), this.props.lang).then((rs) => {
				this.setState({
					weather: rs
				})
			})

	 }
	componentDidMount =async () => {
		await this.getWeather()
	}
	
	render() {
		const { classes, m, t, noSeeMore } = this.props
		const { weather } = this.state
		return <Paper className={classes.paper}>
			<ItemG container>
				<ItemG xs={10} container direction={'column'}>
					<Typography variant={'h5'}>{m.name ? m.name : m.id}</Typography>
					<Typography variant={'body1'}>{`(${m.id})`}</Typography>
				</ItemG>
				<ItemG xs={2} container>
					<ItemG container justify={'flex-end'}>
						{this.renderIcon(m.liveStatus)}
					</ItemG>
				</ItemG>
				<ItemG xs={6}>
					<Typography variant={'body1'}> {`${t('charts.fields.date')}: ${moment().format('lll')}`}</Typography>
				</ItemG>
				<ItemG xs={6}>
					<Caption>{t('devices.fields.temp')}</Caption>
					<Info>{m.temperature} &#8451;</Info>
				</ItemG>
			
				<ItemG xs={12}>
					<Caption>{t('devices.fields.address')}</Caption>
					<Info>{m.address ? m.address : t('devices.noAddress')}</Info>
				</ItemG>
				<Collapse in={Boolean(weather)}>
					<ItemG container>
						<ItemG container xs={12}>
						
							<ItemG container xs={8}>
								<ItemG container direction='row' xs={12}>
									<T>
										{t("charts.fields.summary")}: {weather ? weather.currently.summary : null}
									</T>
								</ItemG>
								<ItemG container direction='row' xs={12}>
									<T>
										{t("charts.fields.temperature")}: {weather ? `${Math.round(weather.currently.temperature)} \u{2103}` : null}
									</T>
								</ItemG>
								<ItemG container direction='row' xs={12}>
									<T>
										{t("charts.fields.windspeed")}: {weather ? `${Math.round(weather.currently.windSpeed / 3.6)} m/s` : null}
									</T>
								</ItemG>
								<ItemG container direction='row' xs={12}>
									<T>
										{t("charts.fields.humidity")}: {weather ? `${weather.currently.humidity * 100}%` : null}
									</T>
								</ItemG>
								<ItemG container direction='row' xs={12}>
									<T>
										{t("charts.fields.pressure")}: {weather ? `${Math.round(weather.currently.pressure)} hPa` : null}
									</T>
								</ItemG>
							</ItemG>
							{weather ? <ItemG xs={4} container justify={'center'} alignItems={'center'}><WeatherIcon icon={weather.currently.icon} /></ItemG> : null}
						</ItemG>
					</ItemG>
				</Collapse>
				{noSeeMore ? null : <ItemG xs={12} container justify={'flex-end'}>
					<Button variant={'text'} style={{ color: teal[500] }} component={Link} to={`/device/${m.id}`}>
						{t('menus.seeMore')}
					</Button>
				</ItemG>}
			</ItemG>
		</Paper>

	}
}
const mapStateToProps = (state) => ({
	lang: state.settings.language
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(styles)(OpenPopup)))
