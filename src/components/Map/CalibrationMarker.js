import React, { useState } from 'react'
import { Marker } from 'react-google-maps';
import { MarkerIcon } from './MarkerIcon';
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import { withStyles } from '@material-ui/core'
import { red, green, yellow } from '@material-ui/core/colors'
import { getDataSummary, getWeather } from 'variables/dataDevices';
import { teal } from '@material-ui/core/colors'
import { useLocalization } from 'hooks';
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
const CalibrationMarker = props => {
	const t = useLocalization()
	const [isOpen, setIsOpen] = useState(false)

	const [liveCount, setLiveCount] = useState(0)
	const [weather, setWeather] = useState(null)
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
			if (weather === null && !m.weather && m.lat && m.long) {
				let newWeather = await getWeather(m, moment(), lang)
				setWeather(newWeather)
				// this.setState({ weather: weather })
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

	const { m, i } = props
	return (
		<Marker icon={{ url: `data:image/svg+xml,${MarkerIcon(teal[500])}` }}
			key={i}
			position={{ lat: m.lat, lng: m.long }} />
	)
}

export default withStyles(styles)(CalibrationMarker)
