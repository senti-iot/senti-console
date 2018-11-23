import React, { Component } from 'react'
import { InfoWindow, Marker } from 'react-google-maps';
import { MarkerIcon } from './MarkerIcon';
import { ItemGrid, Info, Caption, ItemG } from 'components';
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import { withStyles, Button, Paper } from '@material-ui/core'
import { red, green, yellow } from '@material-ui/core/colors'
import { Link } from 'react-router-dom'
import { getDataSummary, getWeather } from 'variables/dataDevices';
import WeatherIcon from 'components/Typography/WeatherIcon';
var moment = require('moment')
const styles = theme => ({ 
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
class MarkerWithInfo extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 isOpen: false,
		 liveCount: 0,
		 weather: null
	  }
	}

	onToggleOpen = async () => {
		const { m, lang } = this.props
		const { isOpen } = this.state
		if (isOpen === false) {
			if (this.state.weather === null && !m.weather && m.lat && m.long) { 
				let weather = await getWeather(m, moment(), lang)
				this.setState({ weather: weather })
			}
			let OneMinuteAgo = moment().subtract(10, 'minute').format('YYYY-MM-DD+HH:mm:ss')
			let rs = await getDataSummary(this.props.m.id, OneMinuteAgo, moment().format('YYYY-MM-DD+HH:mm:ss'), false)
			this.setState({ isOpen: !isOpen, liveCount: rs })
		}
		else { 
			this.setState({ isOpen: !isOpen })
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
				return <div title={t('devices.status.red')}> <SignalWifi2BarLock className={classes.redSignal}/></div>
		}
	}
	render() {
		const { m, i, t } = this.props
		const { isOpen } = this.state
		return (
			<Marker icon={{ url: `data:image/svg+xml,${MarkerIcon(m.color ? m.color : m.liveStatus)}` }} onClick={this.onToggleOpen} key={i} position={{ lat: m.lat, lng: m.long }}>
				{isOpen && <InfoWindow onCloseClick={this.onToggleOpen}
					
					options={{
						alignBottom: true,
						maxWidth: 250,
						boxStyle: {
							// width: '300px'
							background: "red",
							color: "#FF0000"
						},
	
						closeBoxURL: ``,
						enableEventPropagation: true,
					}}>
					<Paper>
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
							{/* * Device name
							* Status
							* Temperature
							* Address
							* Live count (the last record/minute)
							* Button to open device card (full view) */}
						
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
							</ItemG> : this.state.weather ? <ItemG xs={12} container>
								<ItemG xs={3}>
									<WeatherIcon icon={this.state.weather.currently.icon} />
								</ItemG>
								<ItemG xs={9}>
									<Caption>{t('devices.fields.weather')}</Caption>
									<Info>
										{this.state.weather.currently.summary}
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
							<ItemG xs={12}>
								<Caption>{t('devices.liveCount')}</Caption>
								<Info>{this.state.liveCount}</Info>
							</ItemG>
							<ItemG xs={12}>
								<Button variant={'text'} color={'primary'} component={Link} to={`/device/${m.id}`}>
									{/* <NavLink to={`/device/${m.id}`}> */}
									{t('menus.seeMore')}
									{/* </NavLink> */}
								</Button>
							</ItemG>
						</ItemGrid>
					</Paper>

				</InfoWindow>}
			</Marker>
		)
	}
}

export default withStyles(styles, { withTheme: true })(MarkerWithInfo)
