import React, { useState } from 'react'
import { InfoWindow, Marker } from 'react-google-maps';
import { MarkerIcon } from './MarkerIcon';
import { ItemGrid, Info, Caption, ItemG } from 'components';
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import { withStyles, Button, Paper } from '@material-ui/core'
import { red, green, yellow } from '@material-ui/core/colors'
import { Link } from 'react-router-dom'
import { getDataSummary } from 'variables/dataDevices';
import WeatherIcon from 'components/Typography/WeatherIcon';
import { useSelector, useDispatch } from 'react-redux'
import { getWeather } from 'redux/weather';
import { useLocalization } from 'hooks';

var moment = require('moment')
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

// const mapStateToProps = (state) => ({
// 	weather: state.weather.weather,
// 	loadingWeather: state.weather.loading
// })


// const mapDispatchToProps = dispatch => ({
// 	getWeather: async (device, date, lang) => dispatch(await getWeather(device, date, lang))
// })

const MarkerWithInfo = props => {
	const t = useLocalization()
	const weather = useSelector(state => state.weather.weather)
	// const loadingWeather = useSelector(state => state.weather.loading)
	const dispatch = useDispatch()

	const [isOpen, setIsOpen] = useState(false)
	const [liveCount, setLiveCount] = useState(0)
	const [stateWeather, setStateWeather] = useState(null)

	// constructor(props) {
	//   super(props)

	//   this.state = {
	// 	 isOpen: false,
	// 	 liveCount: 0,
	// 	 weather: null
	//   }
	// }

	const onToggleOpen = async () => {
		const { m, lang } = props
		// const { isOpen } = this.state
		if (isOpen === false) {
			if (stateWeather === null && !m.weather && m.lat && m.long) {
				dispatch(await getWeather(m, moment(), lang))
				// await this.props.getWeather(m, moment(), lang)
				setStateWeather(weather)
				// this.setState({ weather: this.props.weather })
			}
			let OneMinuteAgo = moment().subtract(10, 'minute').format('YYYY-MM-DD+HH:mm:ss')
			let rs = await getDataSummary(props.m.id, OneMinuteAgo, moment().format('YYYY-MM-DD+HH:mm:ss'), false)
			setIsOpen(!isOpen)
			setLiveCount(rs)
			// this.setState({ isOpen: !isOpen, liveCount: rs })
		}
		else {
			setIsOpen(!isOpen)
			// this.setState({ isOpen: !isOpen })
		}
	}
	const renderIcon = (status) => {
		const { classes } = props
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

	const { m, i, classes } = props
	// const { isOpen } = this.state
	return (
		<Marker icon={{ url: `data:image/svg+xml,${MarkerIcon(m.color ? m.color : m.liveStatus)}` }} onClick={onToggleOpen} key={i} position={{ lat: m.lat, lng: m.long }}>
			{isOpen && <InfoWindow onCloseClick={onToggleOpen}

				options={{
					alignBottom: true,
					maxWidth: 250,
					closeBoxURL: ``,
					enableEventPropagation: true,
				}}>
				<Paper className={classes.paper}>
					<ItemGrid container noMargin>
						<ItemG xs={6}>
							<Caption>{t('devices.fields.id')}</Caption>
							<Info>
								{m.id}
							</Info>
						</ItemG>
						<ItemG xs={6}>
							<Caption>{t('devices.fields.status')}</Caption>
							{renderIcon(m.liveStatus)}
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
						</ItemG> : stateWeather ? <ItemG xs={12} container>
							<ItemG xs={3}>
								<WeatherIcon icon={stateWeather.currently.icon} />
							</ItemG>
							<ItemG xs={9}>
								<Caption>{t('devices.fields.weather')}</Caption>
								<Info>
									{stateWeather.currently.summary}
								</Info>
							</ItemG>
						</ItemG> : null}
						<ItemG xs={6}>
							<Caption>{t('devices.fields.temp')}</Caption>
							<Info>{m.temperature ? `${m.temperature}\u2103` : `-\u2103`}</Info>
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('devices.fields.address')}</Caption>
							<Info>{m.address ? m.address : t('devices.noAddress')}</Info>
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('devices.liveCount')}</Caption>
							<Info>{liveCount}</Info>
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

export default withStyles(styles, { withTheme: true })(MarkerWithInfo)
