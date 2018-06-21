import React, { Component } from 'react'
import { getDevice } from 'variables/data';
import { CircularProgress, Grid, Typography, withStyles } from '@material-ui/core';
import moment from 'moment'
import { ItemGrid } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { SignalWifi2Bar, SignalWifi2BarLock } from '@material-ui/icons'
import { red, yellow, green } from "@material-ui/core/colors";

const deviceStyles = theme => ({
	redSignal: {
		color: red[700],
		marginRight: 4
	},
	greenSignal: {
		color: green[700],
		margin: 4
	},
	yellowSignal: {
		color: yellow[600]
	},
	InfoSignal: {
		marginBottom: '16px',
		marginTop: '4px',
		marginLeft: '4px'
	}
})
const Caption = (props) => <Typography variant={"caption"}>{props.children}</Typography>
const Info = (props) => <Typography paragraph classes={props.classes}>{props.children}</Typography>

class Device extends Component {
	constructor(props) {
		super(props)

		this.state = {
			device: null,
			loading: true
		}
		props.setHeader(<CircularProgress size={30} />)
	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id)
				await getDevice(id).then(rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {
						this.setState({ device: rs, loading: false })
						this.props.setHeader(rs.device_name ? rs.device_name : rs.device_id)
					}
				})
		}
		else {
			this.props.history.push('/404')
		}
	}
	filterItems = (projects, keyword) => {

		var searchStr = keyword.toLowerCase()
		var arr = projects
		if (arr[0] === undefined)
			return []
		var keys = Object.keys(arr[0])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				if (c[key] === null)
					return searchStr === "null" ? true : false
				if (c[key] instanceof Date) {
					let date = moment(c[key]).format("DD.MM.YYYY")
					return date.toLowerCase().includes(searchStr)
				}
				else
					return c[key].toString().toLowerCase().includes(searchStr)
			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		return filtered
	}
	renderLoader = () => {
		return <Grid container><CircularProgress /></Grid>
	}
	renderStatus = (status) => {
		const { classes } = this.props

				
		switch (status) {
			case 1:
				return	<SignalWifi2Bar className={classes.yellowSignal} />

			case 2:
				return <SignalWifi2Bar className={classes.greenSignal} />

			case 0:
				return <SignalWifi2Bar className={classes.redSignal} />

			case null:
				return <div>
					<SignalWifi2BarLock className={classes.redSignal} />
					<Typography paragraph>
					Error
					</Typography>
				</div>
			default:
				break;
		}
	}
	render() {
		const { device, loading } = this.state
		
		return (
			!loading ?
				<Grid container justify={'center'} alignContent={'space-between'} spacing={8}>
					<ItemGrid xs={12}>
						<InfoCard
							title={"Device Details"}
							subheader={device.device_id}
							noExpand
							content={
								<Grid container>
									<Grid container alignContent={'space-between'} justify={'space-around'}>
										<ItemGrid>
											<Caption>Device Name:</Caption>
											<Info> {device.device_name ? device.device_name : "No name "}</Info>
										</ItemGrid>
										<ItemGrid>
											<Caption>Status:</Caption>
											{this.renderStatus(device.liveStatus)}
										</ItemGrid>
									
									</Grid>
									<Grid container alignContent={'space-between'} justify={'space-around'}>
										<ItemGrid>
											<Caption>Address:</Caption>
											<Info>{device.address} </Info>
										</ItemGrid>
										<ItemGrid>
											<Caption>Street Type:</Caption>
											<Info>{device.streetType} </Info>
										</ItemGrid>
										<ItemGrid>
											<Caption>Coordinates:</Caption>
											<Info>{device.lat + " " + device.long}</Info>
										</ItemGrid>
									</Grid>
									<Grid container alignContent={'space-between'} justify={'space-around'}>
										<ItemGrid>
											<Caption>Organisation:</Caption>
											<Info>{device.organisation ? device.organisation.vcName : "Unassigned"}</Info>
										</ItemGrid>
										<ItemGrid>
											<Caption>Project:</Caption>
											<Info>{device.project ? device.project.title : "Unassigned"}</Info>
										</ItemGrid>
										<ItemGrid>
											<Caption>SIM Provider:</Caption>
											<Info>{device.SIMProvider}</Info>
										</ItemGrid>
									</Grid>
								</Grid>
							}
						/>
					</ItemGrid>
					<ItemGrid xs={12}>
						<InfoCard
							title={"Hardware"}
							subheader={''}
							content={
								<Grid container>
									<Grid container >
										<ItemGrid xs>
											<Caption>
												PC Model:
											</Caption>
											<Info>
												{device.RPImodel}
											</Info>
										</ItemGrid>
										<ItemGrid xs>
											<Caption>
												Memory:
											</Caption>
											<Info>
												{device.memory + " - " + device.memoryModel}
											</Info>
										</ItemGrid>
										<ItemGrid xs>
											<Caption>
												Power Adapter:
											</Caption>
											<Info>
												{device.adapter}
											</Info>
										</ItemGrid>
									</Grid>
									<Grid container>
										<ItemGrid xs>
											<Caption>
												Wifi Module:
											</Caption>
											<Info>
												{device.wifiModule}
											</Info>
										</ItemGrid>
										<ItemGrid xs>
											<Caption>
												Modem Model:
											</Caption>
											<Info>
												{device.modemModel}
											</Info>
										</ItemGrid>
									</Grid>
								</Grid>
							}
							hiddenContent={<Grid container>
								<ItemGrid>
									<Caption>
												Cell Number:
									</Caption>
									<Info>
										{device.cellNumber}
									</Info>
								</ItemGrid>
								<ItemGrid>
									<Caption>
												SIM-Card ID
									</Caption>
									<Info>
										{device.SIMID}
									</Info>
								</ItemGrid>
								<ItemGrid>
									<Caption>
												Modem IMEI:
									</Caption>
									<Info>
										{device.modemIMEI}
									</Info>
								</ItemGrid>
										
							</Grid>
							}
						/>
					</ItemGrid>
				</Grid>
				: this.renderLoader()

		)
	}
}

export default withStyles(deviceStyles)(Device)
