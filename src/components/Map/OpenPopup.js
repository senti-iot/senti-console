import React, { useState, useEffect } from 'react'
import { Paper, Button, withStyles, Typography, Collapse } from '@material-ui/core'
import { ItemG, Caption, Info, WeatherIcon, T } from 'components'
import { Link } from 'react-router-dom'
import withLocalization from 'components/Localization/T'
import { red, green, yellow, teal } from '@material-ui/core/colors'
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import moment from 'moment'
// import { getWeather } from 'variables/dataDevices';
import { useSelector, useDispatch } from 'react-redux'
import { getWeather } from 'redux/weather'
import { useLocalization } from 'hooks'

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

// const mapStateToProps = (state) => ({
// 	lang: state.settings.language,
// 	heatData: state.dateTime.heatData,
// 	weather: state.weather.weather,
// 	loadingWeather: state.weather.loading
// })


// const mapDispatchToProps = dispatch => ({
// 	getWeather: async (device, date, lang) => dispatch(await getWeather(device, date, lang))
// })
/**
 * @Andrei
 */
const OpenPopup = props => {
	const t = useLocalization()
	const dispatch = useDispatch()
	// const lang = useSelector(state => state.settings.language)
	// const heatData = useSelector(state => state.dateTime.heatData)
	const weather = useSelector(state => state.weather.weather)
	// const loadingWeather = useSelector(state => state.weather.loading)

	const [stateWeather, setStateWeather] = useState(null)

	// constructor(props) {
	//   super(props)

	//   this.state = {
	// 	 weather: null
	//   }
	// }


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
	const getWeatherFunc = async () => {
		const { m } = props
		if (m.lat && m.long)
			dispatch(await getWeather({ lat: m.lat, long: m.long }, moment(), props.lang))

				// await this.props.getWeather({ lat: m.lat, long: m.long }, moment(), this.props.lang)
				.then((rs) => {
					setStateWeather(weather)
					// this.setState({
					// 	weather: this.props.weather
					// })
				})

	}
	useEffect(() => {
		const asyncFunc = async () => {
			await getWeatherFunc()
		}
		asyncFunc()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount =async () => {
	// 	await this.getWeather()
	// }

	const { classes, m, noSeeMore, heatMap, dontShow } = props
	// const { weather } = this.state
	return !dontShow ? <Paper className={classes.paper}>
		<ItemG container>
			<ItemG xs={10} container direction={'column'}>
				<Typography variant={'h5'}>{m.name ? m.name : m.id}</Typography>
				<Typography variant={'body1'}>{`(${m.id})`}</Typography>
			</ItemG>
			<ItemG xs={2} container>
				<ItemG container justify={'flex-end'}>
					{renderIcon(m.liveStatus)}
				</ItemG>
			</ItemG>
			<ItemG xs={12}>
				<Typography variant={'body1'}> {`${t('charts.fields.date')}: ${moment().format('lll')}`}</Typography>
			</ItemG>

			<ItemG xs={12}>
				<Caption>{t('devices.fields.address')}</Caption>
				<Info>{m.address ? m.address : t('devices.noAddress')}</Info>
			</ItemG>
			<ItemG xs={6}>
				<Caption>{t('devices.fields.temp')}</Caption>
				<Info>{m.temperature ? `${m.temperature}\u2103` : `-\u2103`}</Info>
			</ItemG>
			{heatMap ? <ItemG xs={6}>
				<Caption>{t('devices.simpleList.totalCount')}</Caption>
				<Info>{m.count ? m.count : 0}</Info>
			</ItemG> : null}
			<Collapse in={Boolean(stateWeather)}>
				<ItemG container>
					<ItemG container xs={12}>

						<ItemG container xs={8}>
							<ItemG container direction='row' xs={12}>
								<T>
									{t("charts.fields.summary")}: {stateWeather ? stateWeather.currently.summary : null}
								</T>
							</ItemG>
							<ItemG container direction='row' xs={12}>
								<T>
									{t("charts.fields.temperature")}: {stateWeather ? `${Math.round(stateWeather.currently.temperature)} \u{2103}` : null}
								</T>
							</ItemG>
							<ItemG container direction='row' xs={12}>
								<T>
									{t("charts.fields.windspeed")}: {stateWeather ? `${Math.round(stateWeather.currently.windSpeed / 3.6)} m/s` : null}
								</T>
							</ItemG>
							<ItemG container direction='row' xs={12}>
								<T>
									{t("charts.fields.humidity")}: {stateWeather ? `${stateWeather.currently.humidity * 100}%` : null}
								</T>
							</ItemG>
							<ItemG container direction='row' xs={12}>
								<T>
									{t("charts.fields.pressure")}: {stateWeather ? `${Math.round(stateWeather.currently.pressure)} hPa` : null}
								</T>
							</ItemG>
						</ItemG>
						{stateWeather ? <ItemG xs={4} container justify={'center'} alignItems={'center'}><WeatherIcon icon={stateWeather.currently.icon} /></ItemG> : null}
					</ItemG>
				</ItemG>
			</Collapse>
			{noSeeMore ? null : <ItemG xs={12} container justify={'flex-end'}>
				<Button variant={'text'} style={{ color: teal[500] }} component={Link} to={`/device/${m.id}`}>
					{t('menus.seeMore')}
				</Button>
			</ItemG>}
		</ItemG>
	</Paper> : null
}

export default withLocalization()(withStyles(styles)(OpenPopup))
