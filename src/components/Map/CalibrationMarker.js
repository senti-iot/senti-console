import React, { Component } from 'react'
import { Marker } from 'react-google-maps';
import { MarkerIcon } from './MarkerIcon';
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import { withStyles } from '@material-ui/core'
import { red, green, yellow } from '@material-ui/core/colors'
import { getDataSummary, getWeather } from 'variables/dataDevices';
import { teal } from "@material-ui/core/colors"
var moment = require("moment")
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
class CalibrationMarker extends Component {
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
			let OneMinuteAgo = moment().subtract(10, "minute").format("YYYY-MM-DD+HH:mm:ss")
			let rs = await getDataSummary(this.props.m.id, OneMinuteAgo, moment().format("YYYY-MM-DD+HH:mm:ss"), false)
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
				return <div title={t("devices.status.yellow")}><SignalWifi2Bar className={classes.yellowSignal} /></div>
			case 2:
				return <div title={t("devices.status.green")}><SignalWifi2Bar className={classes.greenSignal} /></div>
			case 0:
				return <div title={t("devices.status.red")}><SignalWifi2Bar className={classes.redSignal} /></div>
			default:
				return <div title={t("devices.status.red")}> <SignalWifi2BarLock className={classes.redSignal}/></div>
		}
	}
	render() {
		const { m, i, /* t */ } = this.props
		// const { isOpen } = this.state
		return (
			<Marker icon={{ url: `data:image/svg+xml,${MarkerIcon(teal[500])}` }}
				key={i}
				position={{ lat: m.lat, lng: m.long }}/>
		)
	}
}

export default withStyles(styles)(CalibrationMarker)
