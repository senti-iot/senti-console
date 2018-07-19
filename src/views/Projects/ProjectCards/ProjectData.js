import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Grid, IconButton, Menu, MenuItem, withStyles, /* Typography, */ Select, FormControl, FormHelperText, Divider } from '@material-ui/core';
import { AssignmentTurnedIn, MoreVert, DateRange /* Edit */ } from "@material-ui/icons"
// import { dateFormatter } from 'variables/functions';
import { ItemGrid, CircularLoader, Caption, Info, /* , Caption, Info */ } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { Doughnut, Polar, Bar } from 'react-chartjs-2';
import { getWifiSummary } from 'variables/dataDevices';
import { getRandomColor } from 'variables/colors';
var moment = require('moment');


const legendOpts = {
	display: true,
	position: 'bottom',
	fullWidth: true,
	reverse: false,
};

class ProjectData extends Component {
	constructor(props) {
		super(props)

		this.state = {
			from: moment().startOf('day').format(this.format),
			to: moment().endOf('day').format(this.format),
			barDataSets: null,
			roundDataSets: null,
			actionAnchor: null,
			loading: true,
			dateFilterInputID: 0
		}
	}
	getWifiSum = async () => {
		const { project } = this.props
		const { from, to } = this.state
		let dataArr = []
		await Promise.all(project.devices.map(async d => {
			let dataSet = null
			await getWifiSummary(d.device_id, from, to).then(rs => dataSet = { id: d.device_name + "(" + d.device_id + ")", data: rs })
			return dataArr.push(dataSet)
		}))
		this.setState({
			...this.state,
			loading: false,
			roundDataSets: {
				labels: dataArr.map(da => da.id),
				datasets: [{
					label: "",
					borderColor: "#FFF",
					borderWidth: 1,
					data: dataArr.map(d => parseInt(d.data, 10)),
					backgroundColor: dataArr.map(() => getRandomColor())
				}]
			},
			barDataSets: {
				datasets: dataArr.map(d => ({
					label: [d.id],
					borderColor: "#FFF",
					borderWidth: 1,
					data: [parseInt(d.data, 10)],
					backgroundColor: getRandomColor()
				})
				)
			}
		})
	}
	componentDidMount = async () => {
		this._isMounted = 1
		// console.log(this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000)
		if (this._isMounted) {
			this.getWifiSum()
			// console.log(moment().startOf('day').format("YYYY-MM-DD+HH:mm"), moment().endOf('day').format("YYYY-MM-DD+HH:mm"))
			// let todayStart = moment().startOf('day').format("YYYY-MM-DD+HH:mm")
			// let todayEnd = moment().endOf('day').format("YYYY-MM-DD+HH:mm")
			// let dataArr = []
			// await Promise.all(project.devices.map(async d => {
			// 	let dataSet = null
			// 	await getWifiSummary(d.device_id, todayStart, todayEnd).then(rs => dataSet = { id: d.device_name + "(" + d.device_id + ")", data: rs })
			// 	return dataArr.push(dataSet)
			// }))
			// this.setState({
			// 	...this.state,
			// 	loading: false,
			// 	roundDataSets: {
			// 		labels: dataArr.map(da => da.id),
			// 		datasets: [{
			// 			label: "",
			// 			borderColor: "#FFF",
			// 			borderWidth: 1,
			// 			data: dataArr.map(d => parseInt(d.data, 10)),
			// 			backgroundColor: dataArr.map(() => getRandomColor())
			// 		}]
			// 	},
			// 	barDataSets: {
			// 		datasets: dataArr.map(d => ({
			// 			label: [d.id],
			// 			borderColor: "#FFF",
			// 			borderWidth: 1,
			// 			data: [parseInt(d.data, 10)],
			// 			backgroundColor: getRandomColor()
			// 		})
			// 		)
			// 	}
			// })
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	};
	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	};
	format = "YYYY-MM-DD+HH:mm"
	handleSetDate = (id) => {
		let to = null
		let from = null
		switch (id) {
			case 0: // Today
				from = moment().startOf('day').format(this.format)
				to = moment().endOf('day').format(this.format)
				break;
			case 1: // Last 7 days
				from = moment().subtract(7, 'd').startOf('day').format(this.format)
				to = moment().endOf('day').format(this.format)
				break;
			case 2: // last 30 days
				from = moment().subtract(30, 'd').startOf('day').format(this.format)
				to = moment().endOf('day').format(this.format)
				break;
			case 3: // last 90 days
				from = moment().subtract(90, 'd').startOf('day').format(this.format)
				to = moment().endOf('day').format(this.format)
				break;
			default:
				break;
		}
		this.setState({
			...this.state,
			dateFilterInputID: id,
			to: to,
			from: from,
			loading: true
		})
	}
	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 4)
		{
			this.handleSetDate(id)
			this.getWifiSum()
		}
	}
	options = [
		{ id: 0, label: "Today" },
		{ id: 1, label: "Last 7 days" },
		{ id: 2, label: "Last 30 days" },
		{ id: 3, label: "Last 90 days" },
		{ id: 4, label: "Custom Interval" },

	]
	renderDateFilter = () => {
		const { classes } = this.props
		const { dateFilterInputID, to, from } = this.state
		console.log(this.options.findIndex(d => d.id === dateFilterInputID))
		let displayTo = moment(to.substr(0, 10)).format("DD.MM.YYYY")
		let displayFrom = moment(from.substr(0, 10)).format("DD.MM.YYYY")
		return (
			<div className={classes.root}>
				<DateRange className={classes.leftIcon} />
				<FormControl className={classes.formControl}>
					{/* <InputLabel htmlFor="age-simple">Date Filter</InputLabel> */}
					<Select
						value={this.state.dateFilterInputID}
						onChange={this.handleDateFilter}
						inputProps={{
							name: 'data-dateFilter',
							id: 'data-dateFilterInput',
						}}
					>
						<ItemGrid >
							<Caption>{this.options[this.options.findIndex(d => d.id === dateFilterInputID ? true : false)].label}</Caption>
							{/* <Info>{`${from.substr(0, 10)} - ${to.substr(0, 10)}`}</Info> */}
							<Info>{`${displayFrom} - ${displayTo}`}</Info>
						</ItemGrid>
						<Divider />
						<MenuItem value={0}>Today</MenuItem>
						<MenuItem value={1}>Last 7 days</MenuItem>
						<MenuItem value={2}>Last 30 days</MenuItem>
						<MenuItem value={3}>Last 90 days </MenuItem>
						<Divider />
						<MenuItem value={4}>
							<div onClick={() => console.log('hello')}>
								Custom Range
							</div>
						</MenuItem>
					</Select>
					{/* <FormHelperText>{`${from.substr(0, 10)} - ${to.substr(0, 10)}`}</FormHelperText> */}
					<FormHelperText>{`${displayFrom} - ${displayTo}`}</FormHelperText>
				</FormControl>
			</div>
		)
	}
	render() {
		const { actionAnchor, loading } = this.state

		return (
			<InfoCard
				title={"Data"} avatar={<AssignmentTurnedIn />}
				noExpand
				topAction={<ItemGrid container noMargin noPadding>
					{this.renderDateFilter()}
					<IconButton
						aria-label="More"
						aria-owns={actionAnchor ? 'long-menu' : null}
						aria-haspopup="true"
						onClick={this.handleOpenActionsDetails}>
						<MoreVert />
					</IconButton>
					<Menu
						id="long-menu"
						anchorEl={actionAnchor}
						open={Boolean(actionAnchor)}
						onClose={this.handleCloseActionsDetails}
						PaperProps={{
							style: {
								maxHeight: 200,
								minWidth: 200
							}
						}}>
						<MenuItem>
							{/* <Edit className={classes.leftIcon} />Edit project */}
						</MenuItem>
						))}
					</Menu>
				</ItemGrid>}
				content={loading ? <CircularLoader notCentered /> :
					<Grid container>
						{/* <ItemGrid xs={12} container justify={'center'}>
							<Typography variant="display1">Daily Summary</Typography>
						</ItemGrid> */}
						<ItemGrid xs={12} container noPadding>
							{this.state.roundDataSets ? <Doughnut
								height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000}
								width={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerWidth - 40}
								options={{
									maintainAspectRatio: false
								}}
								data={this.state.roundDataSets} legend={legendOpts} responsive /> : null}
						</ItemGrid>
						<ItemGrid xs={12} container noPadding>
							{this.state.roundDataSets ? <Polar
								height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000}
								width={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerWidth - 40}
								options={{
									maintainAspectRatio: false,
								}}
								data={this.state.roundDataSets} legend={legendOpts} responsive /> : null}
						</ItemGrid>
						<ItemGrid xs={12} container noPadding>
							{this.state.barDataSets ? <Bar
								// responsive
								data={this.state.barDataSets}
								legend={legendOpts}
								height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 700 : 1000}
								width={this.props.theme.breakpoints.width("md") < window.innerWidth ? 700 : window.innerWidth - 40}
								options={{
									maintainAspectRatio: false
								}}
							/> : null}
						</ItemGrid>
					</Grid>}
			/>
		);
	}
}
ProjectData.propTypes = {
	// history: PropTypes.any.isRequired,
	// match: PropTypes.any.isRequired,
	project: PropTypes.object.isRequired,
}
export default withStyles(deviceStyles, { withTheme: true })(ProjectData);