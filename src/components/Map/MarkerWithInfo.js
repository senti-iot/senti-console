import React, { Component } from 'react'
import { InfoWindow, Marker } from 'react-google-maps';
import { MarkerIcon } from './MarkerIcon';
import { ItemGrid, Info, Caption, ItemG } from 'components';
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons'
import { withStyles, Button } from '@material-ui/core'
import { red, green, yellow } from '@material-ui/core/colors'
import { Link } from 'react-router-dom'
import { getWifiSummary } from 'variables/dataDevices';
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
class MarkerWithInfo extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 isOpen: false,
		 liveCount: 0
	  }
	}
	onToggleOpen = async () => {
		if (this.state.isOpen === false) {
			let OneMinuteAgo = moment().subtract(10, "minute").format("YYYY-MM-DD+HH:mm:ss")
			let rs = await getWifiSummary(this.props.m.id, OneMinuteAgo, moment().format("YYYY-MM-DD+HH:mm:ss"))
			this.setState({ isOpen: !this.state.isOpen, liveCount: rs })
		}
		else { 
			this.setState({ isOpen: !this.state.isOpen })
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
			case null:
				return <SignalWifi2BarLock />
			default:
				break;
		}
	}
	render() {
		const { m, i, t } = this.props
		const { isOpen } = this.state
		return (
			<Marker icon={{ url: `data:image/svg+xml,${MarkerIcon(m.liveStatus)}` }} onClick={this.onToggleOpen} key={i} position={{ lat: m.lat, lng: m.long }}>
				{isOpen && <InfoWindow onCloseClick={this.onToggleOpen}
					options={{
						alignBottom: true,
						maxWidth: 250,
						// boxStyle: {
						// 	width: '300px'
						// },
						closeBoxURL: ``,
						enableEventPropagation: true
					}}>
					<ItemGrid container noMargin>
						<ItemG xs={6}>
							<Caption>{t("devices.fields.id")}</Caption>
							<Info>
								{m.id}
							</Info>
						</ItemG>
						<ItemG xs={6}>
							<Caption>{t("devices.fields.status")}</Caption>
							{this.renderIcon(m.liveStatus)}
						</ItemG>
						{/* * Device name
							* Status
							* Temperature
							* Address
							* Live count (the last record/minute)
							* Button to open device card (full view) */}
						{m.name ? 
							<ItemG xs={6}>
								<Caption>{t("devices.fields.name")}</Caption>
								<Info>{m.name}</Info>
							</ItemG>
							: null}
					
						<ItemG xs={6}>
							<Caption>{t("devices.fields.temp")}</Caption>
							<Info>{m.temperature} &#8451;</Info>
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t("devices.fields.address")}</Caption>
							<Info>{m.address ? m.address : t("devices.noAddress")}</Info>
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t("devices.liveCount")}</Caption>
							<Info>{this.state.liveCount}</Info>
						</ItemG>
						<ItemG xs={12}>
							<Button variant={"flat"} component={Link} to={`/device/${m.id}`}>
								{/* <NavLink to={`/device/${m.id}`}> */}
								{t("menus.seeMore")}
								{/* </NavLink> */}
							</Button>
						</ItemG>
					</ItemGrid>
				</InfoWindow>}
			</Marker>
		)
	}
}

export default withStyles(styles)(MarkerWithInfo)
